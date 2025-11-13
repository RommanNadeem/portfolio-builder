/**
 * Production-safe logging utility
 * Automatically sanitizes sensitive data and respects environment settings
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Sensitive patterns to redact
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /api[_-]?key/i,
  /secret/i,
  /bearer/i,
  /authorization/i,
  /credential/i,
  /private[_-]?key/i,
];

// Sensitive fields to redact from objects
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'apiKey',
  'api_key',
  'secret',
  'authorization',
  'bearer',
  'private_key',
  'privateKey',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'sessionToken',
  'session_token',
];

/**
 * Sanitize data before logging
 */
function sanitizeData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    // Check if string contains sensitive patterns
    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(data)) {
        return '[REDACTED]';
      }
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  if (typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Check if key is sensitive
      if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string' && value.length > 1000) {
        // Truncate very long strings (might be file contents)
        sanitized[key] = `[TRUNCATED: ${value.length} chars]`;
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Development-only logging
 * Only logs in development environment
 */
export const devLog = {
  log: (...args: any[]) => {
    if (IS_DEVELOPMENT) {
      console.log(...args.map(sanitizeData));
    }
  },
  
  warn: (...args: any[]) => {
    if (IS_DEVELOPMENT) {
      console.warn(...args.map(sanitizeData));
    }
  },
  
  error: (...args: any[]) => {
    if (IS_DEVELOPMENT) {
      console.error(...args.map(sanitizeData));
    }
  },
  
  info: (...args: any[]) => {
    if (IS_DEVELOPMENT) {
      console.info(...args.map(sanitizeData));
    }
  },
};

/**
 * Production-safe error logging
 * Always logs errors but sanitizes sensitive data
 */
export const errorLog = {
  error: (message: string, error?: any, context?: any) => {
    const sanitizedError = error instanceof Error 
      ? { message: error.message, name: error.name, stack: IS_DEVELOPMENT ? error.stack : undefined }
      : sanitizeData(error);
    
    const sanitizedContext = sanitizeData(context);
    
    console.error(`[ERROR] ${message}`, sanitizedError, sanitizedContext);
    
    // TODO: Send to error tracking service (Sentry, etc.)
    // if (IS_PRODUCTION) {
    //   sendToErrorTracking({ message, error: sanitizedError, context: sanitizedContext });
    // }
  },
  
  warn: (message: string, context?: any) => {
    console.warn(`[WARN] ${message}`, sanitizeData(context));
  },
};

/**
 * Feature-specific logging with automatic categorization
 */
export const createLogger = (feature: string) => {
  return {
    debug: (...args: any[]) => {
      if (IS_DEVELOPMENT) {
        console.log(`[${feature}]`, ...args.map(sanitizeData));
      }
    },
    
    info: (message: string, data?: any) => {
      if (IS_DEVELOPMENT) {
        console.info(`[${feature}] ${message}`, sanitizeData(data));
      }
    },
    
    warn: (message: string, data?: any) => {
      console.warn(`[${feature}] ${message}`, sanitizeData(data));
    },
    
    error: (message: string, error?: any, data?: any) => {
      const sanitizedError = error instanceof Error 
        ? { message: error.message, name: error.name, stack: IS_DEVELOPMENT ? error.stack : undefined }
        : sanitizeData(error);
      
      console.error(`[${feature}] ${message}`, sanitizedError, sanitizeData(data));
    },
    
    // Success messages for important operations
    success: (message: string, data?: any) => {
      if (IS_DEVELOPMENT) {
        console.log(`[${feature}] ✅ ${message}`, sanitizeData(data));
      }
    },
  };
};

/**
 * Performance logging
 */
export const perfLog = {
  start: (label: string): (() => void) => {
    if (IS_DEVELOPMENT) {
      const startTime = performance.now();
      return () => {
        const duration = performance.now() - startTime;
        console.log(`[PERF] ${label}: ${duration.toFixed(2)}ms`);
      };
    }
    return () => {}; // No-op in production
  },
};

/**
 * User action logging (for analytics, not debugging)
 * Safe to use in production
 */
export const analyticsLog = {
  event: (eventName: string, properties?: Record<string, any>) => {
    // Sanitize properties
    const sanitizedProps = sanitizeData(properties);
    
    if (IS_DEVELOPMENT) {
      console.log(`[ANALYTICS] ${eventName}`, sanitizedProps);
    }
    
    // TODO: Send to analytics service
    // sendToAnalytics(eventName, sanitizedProps);
  },
};

export default {
  dev: devLog,
  error: errorLog,
  create: createLogger,
  perf: perfLog,
  analytics: analyticsLog,
};

