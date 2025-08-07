const NodeFnListenerImpl = require('./lib/impl');
const { parseEvent } = require('./lib/utils');
const { Logger } = require('./lib/logger');
const { createError } = require('./lib/errors');

// Export main class
const NodeFnListener = NodeFnListenerImpl;

// Export utility functions and classes
module.exports = NodeFnListener;
module.exports.parseEvent = parseEvent;
module.exports.Logger = Logger;
module.exports.createError = createError;
module.exports.default = NodeFnListener;

// For backward compatibility, also export static methods
class NodeFnListenerWithStatic extends NodeFnListenerImpl {
  /**
   * Parse event message
   * @param {string} message - Event message
   * @returns {Object|null} Parsed event object
   */
  static parseEvent(message) {
    return parseEvent(message);
  }
}

module.exports.NodeFnListener = NodeFnListener;
module.exports.NodeFnListenerWithStatic = NodeFnListenerWithStatic;

// Export error classes
module.exports.NodeFnListenerError = require('./lib/errors').NodeFnListenerError;
module.exports.PermissionError = require('./lib/errors').PermissionError;
module.exports.ListenerStateError = require('./lib/errors').ListenerStateError;
module.exports.NativeModuleError = require('./lib/errors').NativeModuleError;
module.exports.EventParseError = require('./lib/errors').EventParseError;

// Export constants
module.exports.EVENT_TYPES = require('./lib/constants').EVENT_TYPES;
module.exports.LISTENER_STATES = require('./lib/constants').LISTENER_STATES;
module.exports.ERROR_TYPES = require('./lib/constants').ERROR_TYPES;
module.exports.LOG_LEVELS = require('./lib/constants').LOG_LEVELS; 