const EventEmitter = require('events');

/**
 * Node Fn Listener Event Emitter
 */
class NodeFnListenerEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20); // Increase maximum listener count
  }

  /**
   * Emit Fn key event
   */
  emitFnEvent(eventData) {
    this.emit('fn-event', eventData);
    
    // Also emit specific event types
    if (eventData.event_type === 'keydown') {
      this.emit('fn-keydown', eventData);
    } else if (eventData.event_type === 'keyup') {
      this.emit('fn-keyup', eventData);
    }
  }

  /**
   * Emit state change event
   */
  emitStateChange(oldState, newState) {
    this.emit('state-change', { oldState, newState });
  }

  /**
   * Emit error event
   */
  emitError(error) {
    this.emit('error', error);
  }

  /**
   * Emit permission change event
   */
  emitPermissionChange(hasPermission) {
    this.emit('permission-change', { hasPermission });
  }

  /**
   * Emit listener start event
   */
  emitListenerStart() {
    this.emit('listener-start');
  }

  /**
   * Emit listener stop event
   */
  emitListenerStop() {
    this.emit('listener-stop');
  }
}

module.exports = NodeFnListenerEventEmitter; 