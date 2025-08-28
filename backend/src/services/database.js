const logger = require('../utils/logger');

// Mock database implementation for development
// Mock PostgreSQL service for hackathon demonstration
class Database {
  constructor() {
    this.connected = false;
    this.tables = {
      users: new Map(),
      content: new Map(),
      transactions: new Map(),
      analytics: new Map()
    };
  }

  async connect() {
    try {
      // Mock PostgreSQL connection for hackathon demonstration
      // For now, simulate connection
      this.connected = true;
      logger.info('Database connected successfully (mock)');
      return true;
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      this.connected = false;
      logger.info('Database disconnected');
      return true;
    } catch (error) {
      logger.error('Database disconnection failed:', error);
      throw error;
    }
  }

  isConnected() {
    return this.connected;
  }

  // User operations
  async createUser(userData) {
    const id = Math.random().toString(36).substr(2, 9);
    const user = {
      id,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tables.users.set(id, user);
    return user;
  }

  async getUserById(id) {
    return this.tables.users.get(id) || null;
  }

  async getUserByEmail(email) {
    for (const [id, user] of this.tables.users) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id, updates) {
    const user = this.tables.users.get(id);
    if (!user) return null;
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.tables.users.set(id, updatedUser);
    return updatedUser;
  }

  // Content operations
  async createContent(contentData) {
    const id = Math.random().toString(36).substr(2, 9);
    const content = {
      id,
      ...contentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tables.content.set(id, content);
    return content;
  }

  async getContentById(id) {
    return this.tables.content.get(id) || null;
  }

  async getContentByCreator(creatorId, limit = 10, offset = 0) {
    const content = Array.from(this.tables.content.values())
      .filter(item => item.creatorId === creatorId)
      .slice(offset, offset + limit);
    return content;
  }

  async updateContent(id, updates) {
    const content = this.tables.content.get(id);
    if (!content) return null;
    
    const updatedContent = {
      ...content,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.tables.content.set(id, updatedContent);
    return updatedContent;
  }

  // Transaction operations
  async createTransaction(transactionData) {
    const id = Math.random().toString(36).substr(2, 9);
    const transaction = {
      id,
      ...transactionData,
      createdAt: new Date().toISOString()
    };
    this.tables.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionById(id) {
    return this.tables.transactions.get(id) || null;
  }

  async getTransactionsByUser(userId, limit = 20, offset = 0) {
    const transactions = Array.from(this.tables.transactions.values())
      .filter(tx => tx.userId === userId || tx.recipientId === userId)
      .slice(offset, offset + limit);
    return transactions;
  }

  // Analytics operations
  async recordAnalyticsEvent(eventData) {
    const id = Math.random().toString(36).substr(2, 9);
    const event = {
      id,
      ...eventData,
      timestamp: new Date().toISOString()
    };
    this.tables.analytics.set(id, event);
    return event;
  }

  async getAnalytics(filters = {}) {
    let events = Array.from(this.tables.analytics.values());
    
    if (filters.userId) {
      events = events.filter(event => event.userId === filters.userId);
    }
    
    if (filters.eventType) {
      events = events.filter(event => event.eventType === filters.eventType);
    }
    
    if (filters.startDate) {
      events = events.filter(event => new Date(event.timestamp) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      events = events.filter(event => new Date(event.timestamp) <= new Date(filters.endDate));
    }
    
    return events;
  }
}

let dbInstance = null;

const initializeDatabase = async () => {
  try {
    if (!dbInstance) {
      dbInstance = new Database();
      await dbInstance.connect();
    }
    return dbInstance;
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
};

const getDatabase = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbInstance;
};

module.exports = {
  initializeDatabase,
  getDatabase,
  Database
};
