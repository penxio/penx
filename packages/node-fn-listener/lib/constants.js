/**
 * Node Fn Listener Constants Definition
 */

// Event types
export const EVENT_TYPES = {
  KEYDOWN: 'keydown',
  KEYUP: 'keyup'
};

// Default configuration
export const DEFAULT_CONFIG = {
  // Default Fn key code
  DEFAULT_FN_KEY_CODE: 63,
  
  // Event message format
  EVENT_MESSAGE_FORMAT: '{event_type}:{key_code}:{timestamp}',
  
  // Permission check options
  PERMISSION_OPTIONS: {
    prompt: false
  },
  
  // Listener configuration
  LISTENER_CONFIG: {
    // Whether to auto-retry
    autoRetry: false,
    // Retry interval (milliseconds)
    retryInterval: 1000,
    // Maximum retry attempts
    maxRetries: 3
  }
};

// Error types
export const ERROR_TYPES = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  LISTENER_ALREADY_RUNNING: 'LISTENER_ALREADY_RUNNING',
  LISTENER_NOT_RUNNING: 'LISTENER_NOT_RUNNING',
  NATIVE_MODULE_ERROR: 'NATIVE_MODULE_ERROR',
  INVALID_EVENT_MESSAGE: 'INVALID_EVENT_MESSAGE'
};

// State enumeration
export const LISTENER_STATES = {
  IDLE: 'idle',
  STARTING: 'starting',
  RUNNING: 'running',
  STOPPING: 'stopping',
  ERROR: 'error'
};

// Log levels
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}; 