const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      logMessage += ` ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      logMessage += `\n${stack}`;
    }
    
    return logMessage;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Write errors to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Write to console in development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      silent: process.env.NODE_ENV === 'test'
    })
  ]
});

// Add performance logging methods
logger.performance = {
  start: (operation) => {
    const startTime = Date.now();
    return {
      end: (additionalData = {}) => {
        const duration = Date.now() - startTime;
        logger.info(`Performance: ${operation}`, {
          operation,
          duration: `${duration}ms`,
          ...additionalData
        });
        return duration;
      }
    };
  }
};

// Add structured logging methods
logger.audit = (action, details = {}) => {
  logger.info('Audit Log', {
    type: 'audit',
    action,
    timestamp: new Date().toISOString(),
    ...details
  });
};

logger.security = (event, details = {}) => {
  logger.warn('Security Event', {
    type: 'security',
    event,
    timestamp: new Date().toISOString(),
    ...details
  });
};

logger.business = (metric, value, details = {}) => {
  logger.info('Business Metric', {
    type: 'business',
    metric,
    value,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// API request logging middleware
logger.requestMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  req.id = requestId;
  
  // Log request
  logger.info('HTTP Request', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.userId || 'anonymous'
  });
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    logger.info('HTTP Response', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.userId || 'anonymous'
    });
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Error logging with context
logger.errorWithContext = (error, context = {}) => {
  logger.error('Error with context', {
    error: error.message,
    stack: error.stack,
    name: error.name,
    ...context
  });
};

// AI service logging
logger.ai = {
  request: (model, prompt, options = {}) => {
    logger.info('AI Request', {
      type: 'ai_request',
      model,
      promptLength: prompt?.length || 0,
      ...options
    });
  },
  
  response: (model, tokensUsed, duration, result = {}) => {
    logger.info('AI Response', {
      type: 'ai_response',
      model,
      tokensUsed,
      duration: `${duration}ms`,
      success: result.success !== false,
      ...result
    });
  },
  
  error: (model, error, context = {}) => {
    logger.error('AI Error', {
      type: 'ai_error',
      model,
      error: error.message,
      ...context
    });
  }
};

// Blockchain logging
logger.blockchain = {
  transaction: (type, signature, amount = null) => {
    logger.info('Blockchain Transaction', {
      type: 'blockchain_transaction',
      transactionType: type,
      signature,
      amount,
      timestamp: new Date().toISOString()
    });
  },
  
  error: (operation, error, context = {}) => {
    logger.error('Blockchain Error', {
      type: 'blockchain_error',
      operation,
      error: error.message,
      ...context
    });
  }
};

// Payment logging
logger.payment = {
  initiated: (paymentId, amount, from, to) => {
    logger.info('Payment Initiated', {
      type: 'payment_initiated',
      paymentId,
      amount,
      from,
      to,
      timestamp: new Date().toISOString()
    });
  },
  
  completed: (paymentId, signature, duration) => {
    logger.info('Payment Completed', {
      type: 'payment_completed',
      paymentId,
      signature,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  },
  
  failed: (paymentId, error, reason) => {
    logger.error('Payment Failed', {
      type: 'payment_failed',
      paymentId,
      error: error.message,
      reason,
      timestamp: new Date().toISOString()
    });
  }
};

// Content analysis logging
logger.content = {
  analyzed: (contentId, qualityScore, processingTime) => {
    logger.info('Content Analyzed', {
      type: 'content_analyzed',
      contentId,
      qualityScore,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });
  },
  
  fraud: (contentId, riskLevel, flags) => {
    logger.warn('Fraud Detection', {
      type: 'fraud_detection',
      contentId,
      riskLevel,
      flags,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = logger;
