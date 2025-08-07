const { LOG_LEVELS } = require('./constants');

/**
 * Simple Logging System
 */
class Logger {
  constructor(options = {}) {
    this.level = options.level || LOG_LEVELS.INFO;
    this.prefix = options.prefix || '[NodeFnListener]';
    this.enabled = options.enabled !== false;
  }

  /**
   * Format log message
   */
  format(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const levelName = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level) || 'UNKNOWN';
    return `${this.prefix} [${levelName}] ${timestamp}: ${message}`;
  }

  /**
   * Output log
   */
  log(level, message, ...args) {
    if (!this.enabled || level < this.level) return;
    
    const formattedMessage = this.format(level, message, ...args);
    console.log(formattedMessage, ...args);
  }

  debug(message, ...args) {
    this.log(LOG_LEVELS.DEBUG, message, ...args);
  }

  info(message, ...args) {
    this.log(LOG_LEVELS.INFO, message, ...args);
  }

  warn(message, ...args) {
    this.log(LOG_LEVELS.WARN, message, ...args);
  }

  error(message, ...args) {
    this.log(LOG_LEVELS.ERROR, message, ...args);
  }

  /**
   * Set log level
   */
  setLevel(level) {
    this.level = level;
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

// Create default logger instance
const defaultLogger = new Logger();

module.exports = {
  Logger,
  defaultLogger
}; 