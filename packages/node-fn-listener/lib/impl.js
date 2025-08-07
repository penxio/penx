const { setupLibraryPath, parseEvent, checkCompatibility, retry } = require('./utils');
const { createError } = require('./errors');
const { defaultLogger } = require('./logger');
const NodeFnListenerEventEmitter = require('./event-emitter');
const { LISTENER_STATES, DEFAULT_CONFIG } = require('./constants');

// Setup library path
setupLibraryPath();

// Load native module
let nativeModule;
try {
  nativeModule = require('../build/Release/node_fn_listener.node');
} catch (error) {
  defaultLogger.error('Failed to load native module:', error);
  throw createError.nativeModule('Failed to load native module', error);
}

const {
  checkAccessibilityPermission,
  requestAccessibilityPermission,
  startListening,
  stopListening,
  isListening,
  getFnKeyCode,
  isFnPressed
} = nativeModule;

// Direct use of functions from nativeModule
const simulateFnKeydown = nativeModule.simulateFnKeydown;
const simulateFnKeyup = nativeModule.simulateFnKeyup;

/**
 * Node Fn Listener - Global fn key listener based on Loop project
 *
 * This module directly uses the Loop project's Swift implementation, providing the same functionality,
 * but as an independent npm package that can be used in any Node.js or Electron application.
 */
class NodeFnListenerImpl extends NodeFnListenerEventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = { ...DEFAULT_CONFIG, ...options };
    this.nativeModule = nativeModule;
    this.state = LISTENER_STATES.IDLE;
    this.callback = null;
    this.retryCount = 0;
    this.logger = options.logger || defaultLogger;
    
    // Check compatibility
    const compatibility = checkCompatibility();
    if (!compatibility.isSupported) {
      throw createError.nativeModule(`Platform ${compatibility.platform} is not supported`);
    }
    
    this.logger.info('NodeFnListener initialized', { compatibility });
  }

  /**
   * Get current state
   */
  get currentState() {
    return this.state;
  }

  /**
   * Set state
   */
  setState(newState) {
    const oldState = this.state;
    this.state = newState;
    this.emitStateChange(oldState, newState);
    this.logger.debug('State changed', { oldState, newState });
  }

  /**
   * Start listening for fn key
   * @param {Function} callback - Callback function to receive event messages
   * @returns {Promise<boolean>} Whether successfully started
   */
  async start(callback) {
    if (this.state === LISTENER_STATES.RUNNING) {
      throw createError.listenerAlreadyRunning();
    }

    this.setState(LISTENER_STATES.STARTING);
    this.logger.info('Starting listener...');

    try {
      // Check permission
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        this.setState(LISTENER_STATES.ERROR);
        this.emitError(createError.permission());
        return false;
      }

      this.callback = callback;
      
      // Use retry mechanism to start listener
      const success = await retry(
        () => startListening(this.handleNativeCallback.bind(this)),
        {
          maxRetries: this.options.LISTENER_CONFIG.maxRetries,
          delayMs: this.options.LISTENER_CONFIG.retryInterval,
          onRetry: (error, attempt) => {
            this.logger.warn(`Retry attempt ${attempt} failed:`, error);
          }
        }
      );

      if (success) {
        this.setState(LISTENER_STATES.RUNNING);
        this.emitListenerStart();
        this.logger.info('Listener started successfully');
        return true;
      } else {
        this.setState(LISTENER_STATES.ERROR);
        this.emitError(createError.nativeModule('Failed to start listener'));
        return false;
      }
    } catch (error) {
      this.setState(LISTENER_STATES.ERROR);
      this.emitError(error);
      this.logger.error('Failed to start listener:', error);
      return false;
    }
  }

  /**
   * Stop listening
   * @returns {Promise<boolean>} Whether successfully stopped
   */
  async stop() {
    if (this.state !== LISTENER_STATES.RUNNING) {
      throw createError.listenerNotRunning();
    }

    this.setState(LISTENER_STATES.STOPPING);
    this.logger.info('Stopping listener...');

    try {
      const success = stopListening();
      
      if (success) {
        this.setState(LISTENER_STATES.IDLE);
        this.callback = null;
        this.emitListenerStop();
        this.logger.info('Listener stopped successfully');
        return true;
      } else {
        this.setState(LISTENER_STATES.ERROR);
        this.emitError(createError.nativeModule('Failed to stop listener'));
        return false;
      }
    } catch (error) {
      this.setState(LISTENER_STATES.ERROR);
      this.emitError(error);
      this.logger.error('Failed to stop listener:', error);
      return false;
    }
  }

  /**
   * Get listening status
   */
  get listening() {
    return this.state === LISTENER_STATES.RUNNING && isListening();
  }

  /**
   * Request permission
   */
  async requestPermission() {
    this.logger.info('Requesting accessibility permission...');
    
    try {
      const success = requestAccessibilityPermission();
      this.emitPermissionChange(success);
      
      if (success) {
        this.logger.info('Permission granted');
      } else {
        this.logger.warn('Permission denied');
      }
      
      return success;
    } catch (error) {
      this.logger.error('Error requesting permission:', error);
      this.emitError(error);
      return false;
    }
  }

  /**
   * Check permission
   */
  checkPermission() {
    try {
      return checkAccessibilityPermission();
    } catch (error) {
      this.logger.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Get fn key code
   */
  get fnKeyCode() {
    try {
      return getFnKeyCode();
    } catch (error) {
      this.logger.error('Error getting fn key code:', error);
      return DEFAULT_CONFIG.DEFAULT_FN_KEY_CODE;
    }
  }

  /**
   * Check if fn key is pressed
   */
  get fnPressed() {
    try {
      return isFnPressed();
    } catch (error) {
      this.logger.error('Error checking fn pressed state:', error);
      return false;
    }
  }

  /**
   * Simulate fn key down
   */
  async simulateKeydown() {
    try {
      this.logger.debug('Simulating fn key down');
      const result = simulateFnKeydown();
      return result;
    } catch (error) {
      this.logger.error('Error simulating keydown:', error);
      this.emitError(error);
      return false;
    }
  }

  /**
   * Simulate fn key up
   */
  async simulateKeyup() {
    try {
      this.logger.debug('Simulating fn key up');
      const result = simulateFnKeyup();
      return result;
    } catch (error) {
      this.logger.error('Error simulating keyup:', error);
      this.emitError(error);
      return false;
    }
  }

  /**
   * Handle native callback
   */
  handleNativeCallback(message) {
    try {
      const eventData = parseEvent(message);
      this.logger.debug('Received native event:', eventData);
      
      // Emit event
      this.emitFnEvent(eventData);
      
      // Call user callback
      if (this.callback) {
        this.callback(message);
      }
    } catch (error) {
      this.logger.error('Error handling native callback:', error);
      this.emitError(error);
    }
  }

  /**
   * Parse event message
   * @param {string} message - Event message
   * @returns {Object|null} Parsed event object
   */
  parseEvent(message) {
    try {
      return parseEvent(message);
    } catch (error) {
      this.logger.error('Error parsing event:', error);
      return null;
    }
  }

  /**
   * Destroy instance
   */
  destroy() {
    if (this.state === LISTENER_STATES.RUNNING) {
      this.stop().catch(error => {
        this.logger.error('Error stopping listener during destroy:', error);
      });
    }
    
    this.removeAllListeners();
    this.logger.info('NodeFnListener destroyed');
  }
}

module.exports = NodeFnListenerImpl; 