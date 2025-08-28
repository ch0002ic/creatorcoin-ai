const redis = require('redis');
const logger = require('../utils/logger');

// Mock Redis implementation for development
class MockRedis {
  constructor() {
    this.connected = false;
    this.store = new Map();
  }

  async connect() {
    this.connected = true;
    logger.info('Redis connected successfully (mock)');
  }

  async disconnect() {
    this.connected = false;
    logger.info('Redis disconnected');
  }

  isConnected() {
    return this.connected;
  }

  async set(key, value, options = {}) {
    this.store.set(key, {
      value: JSON.stringify(value),
      timestamp: Date.now(),
      ttl: options.EX ? options.EX * 1000 : null
    });
    return 'OK';
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    
    // Check TTL
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      this.store.delete(key);
      return null;
    }
    
    return JSON.parse(item.value);
  }

  async del(key) {
    return this.store.delete(key) ? 1 : 0;
  }

  async exists(key) {
    return this.store.has(key) ? 1 : 0;
  }

  async expire(key, seconds) {
    const item = this.store.get(key);
    if (!item) return 0;
    
    item.ttl = seconds * 1000;
    return 1;
  }

  async flushall() {
    this.store.clear();
    return 'OK';
  }

  async keys(pattern) {
    // Simple pattern matching for asterisk
    if (pattern === '*') {
      return Array.from(this.store.keys());
    }
    
    // Basic pattern support
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return Array.from(this.store.keys()).filter(key => regex.test(key));
  }

  // Hash operations
  async hset(key, field, value) {
    const hashKey = `hash:${key}`;
    let hash = this.store.get(hashKey);
    if (!hash) {
      hash = { value: {}, timestamp: Date.now(), ttl: null };
    } else {
      hash.value = JSON.parse(hash.value);
    }
    
    hash.value[field] = value;
    hash.value = JSON.stringify(hash.value);
    this.store.set(hashKey, hash);
    return 1;
  }

  async hget(key, field) {
    const hashKey = `hash:${key}`;
    const hash = this.store.get(hashKey);
    if (!hash) return null;
    
    const hashValue = JSON.parse(hash.value);
    return hashValue[field] || null;
  }

  async hgetall(key) {
    const hashKey = `hash:${key}`;
    const hash = this.store.get(hashKey);
    if (!hash) return {};
    
    return JSON.parse(hash.value);
  }

  // List operations
  async lpush(key, ...values) {
    const listKey = `list:${key}`;
    let list = this.store.get(listKey);
    if (!list) {
      list = { value: [], timestamp: Date.now(), ttl: null };
    } else {
      list.value = JSON.parse(list.value);
    }
    
    list.value.unshift(...values);
    list.value = JSON.stringify(list.value);
    this.store.set(listKey, list);
    return list.value.length;
  }

  async lrange(key, start, stop) {
    const listKey = `list:${key}`;
    const list = this.store.get(listKey);
    if (!list) return [];
    
    const listValue = JSON.parse(list.value);
    return listValue.slice(start, stop === -1 ? undefined : stop + 1);
  }
}

let redisClient = null;

const initializeRedis = async () => {
  try {
    if (!redisClient) {
      // For development, use mock Redis
      // TODO: Replace with actual Redis connection in production
      if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
        redisClient = redis.createClient({
          url: process.env.REDIS_URL
        });
        
        redisClient.on('error', (err) => {
          logger.error('Redis error:', err);
        });
        
        redisClient.on('connect', () => {
          logger.info('Redis connected successfully');
        });
        
        await redisClient.connect();
      } else {
        redisClient = new MockRedis();
        await redisClient.connect();
      }
    }
    return redisClient;
  } catch (error) {
    logger.error('Failed to initialize Redis:', error);
    throw error;
  }
};

const getRedis = () => {
  if (!redisClient) {
    throw new Error('Redis not initialized. Call initializeRedis() first.');
  }
  return redisClient;
};

// Cache helper functions
const cache = {
  async get(key) {
    try {
      const client = getRedis();
      return await client.get(key);
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  async set(key, value, ttl = 3600) {
    try {
      const client = getRedis();
      return await client.set(key, value, { EX: ttl });
    } catch (error) {
      logger.error('Cache set error:', error);
      return null;
    }
  },

  async del(key) {
    try {
      const client = getRedis();
      return await client.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
      return 0;
    }
  },

  async exists(key) {
    try {
      const client = getRedis();
      return await client.exists(key);
    } catch (error) {
      logger.error('Cache exists error:', error);
      return 0;
    }
  }
};

// Session management
const session = {
  async store(sessionId, data, ttl = 86400) {
    const key = `session:${sessionId}`;
    return await cache.set(key, data, ttl);
  },

  async get(sessionId) {
    const key = `session:${sessionId}`;
    return await cache.get(key);
  },

  async destroy(sessionId) {
    const key = `session:${sessionId}`;
    return await cache.del(key);
  }
};

// Rate limiting
const rateLimit = {
  async check(identifier, limit = 100, window = 3600) {
    try {
      const client = getRedis();
      const key = `rate:${identifier}`;
      const current = await client.get(key) || 0;
      
      if (current >= limit) {
        return { allowed: false, remaining: 0, resetTime: window };
      }
      
      await client.set(key, parseInt(current) + 1, { EX: window });
      return { allowed: true, remaining: limit - parseInt(current) - 1, resetTime: window };
    } catch (error) {
      logger.error('Rate limit check error:', error);
      return { allowed: true, remaining: limit - 1, resetTime: window };
    }
  }
};

module.exports = {
  initializeRedis,
  getRedis,
  cache,
  session,
  rateLimit
};
