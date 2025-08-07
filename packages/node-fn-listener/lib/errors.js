const { ERROR_TYPES } = require('./constants');

/**
 * Node Fn Listener Error Classes
 */
class NodeFnListenerError extends Error {
  constructor(type, message, cause = null) {
    super(message);
    this.name = 'NodeFnListenerError';
    this.type = type;
    this.cause = cause;
  }
}

/**
 * Permission Error
 */
class PermissionError extends NodeFnListenerError {
  constructor(message = 'Accessibility permission denied', cause = null) {
    super(ERROR_TYPES.PERMISSION_DENIED, message, cause);
    this.name = 'PermissionError';
  }
}

/**
 * Listener State Error
 */
class ListenerStateError extends NodeFnListenerError {
  constructor(type, message, cause = null) {
    super(type, message, cause);
    this.name = 'ListenerStateError';
  }
}

/**
 * Native Module Error
 */
class NativeModuleError extends NodeFnListenerError {
  constructor(message = 'Native module error', cause = null) {
    super(ERROR_TYPES.NATIVE_MODULE_ERROR, message, cause);
    this.name = 'NativeModuleError';
  }
}

/**
 * Event Parse Error
 */
class EventParseError extends NodeFnListenerError {
  constructor(message = 'Invalid event message format', cause = null) {
    super(ERROR_TYPES.INVALID_EVENT_MESSAGE, message, cause);
    this.name = 'EventParseError';
  }
}

/**
 * Error factory functions
 */
const createError = {
  permission: (message, cause) => new PermissionError(message, cause),
  listenerAlreadyRunning: (cause = null) => new ListenerStateError(
    ERROR_TYPES.LISTENER_ALREADY_RUNNING,
    'Listener is already running',
    cause
  ),
  listenerNotRunning: (cause = null) => new ListenerStateError(
    ERROR_TYPES.LISTENER_NOT_RUNNING,
    'Listener is not running',
    cause
  ),
  nativeModule: (message, cause) => new NativeModuleError(message, cause),
  eventParse: (message, cause) => new EventParseError(message, cause)
};

module.exports = {
  NodeFnListenerError,
  PermissionError,
  ListenerStateError,
  NativeModuleError,
  EventParseError,
  createError
}; 