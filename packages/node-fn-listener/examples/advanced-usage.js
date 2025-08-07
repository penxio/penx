const NodeFnListener = require('../index.js');
const { Logger, LOG_LEVELS, LISTENER_STATES, EVENT_TYPES } = require('../index.js');

/**
 * Advanced Usage Example
 * Demonstrates new features after refactoring, including event system, logging system, error handling, etc.
 */

async function advancedUsageExample() {
  console.log('=== Node Fn Listener Advanced Usage Example ===\n');

  // 1. Create custom logger
  const logger = new Logger({
    level: LOG_LEVELS.DEBUG,
    prefix: '[MyApp]',
    enabled: true
  });

  // 2. Create listener instance with configuration options
  const listener = new NodeFnListener({
    logger,
    LISTENER_CONFIG: {
      autoRetry: true,
      retryInterval: 1000,
      maxRetries: 3
    }
  });

  try {
    // 3. Setup event listeners
    setupEventListeners(listener);

    // 4. Check compatibility
    console.log('--- Compatibility Check ---');
    const compatibility = require('../lib/utils').checkCompatibility();
    console.log('Platform:', compatibility.platform);
    console.log('Architecture:', compatibility.arch);
    console.log('Supported:', compatibility.isSupported);

    // 5. Check permission
    console.log('\n--- Permission Check ---');
    const hasPermission = listener.checkPermission();
    console.log('Has permission:', hasPermission);

    if (!hasPermission) {
      console.log('Requesting permission...');
      const granted = await listener.requestPermission();
      console.log('Permission granted:', granted);
      
      if (!granted) {
        console.log('⚠️  Permission denied. Please grant accessibility permission in System Preferences.');
        return;
      }
    }

    // 6. Start listener
    console.log('\n--- Starting Listener ---');
    const success = await listener.start((message) => {
      console.log('Raw message:', message);
    });

    if (!success) {
      console.log('❌ Failed to start listener');
      return;
    }

    console.log('✅ Listener started successfully');
    console.log('Current state:', listener.currentState);
    console.log('Listening status:', listener.listening);

    // 7. Wait for user to press Fn key
    console.log('\n--- Waiting for Fn Key Events ---');
    console.log('Press the Fn key to see events...');
    console.log('(Or wait 10 seconds for simulation)');

    // 8. Simulate key events after 10 seconds
    setTimeout(async () => {
      console.log('\n--- Simulating Fn Key Events ---');
      
      console.log('Simulating Fn key down...');
      await listener.simulateKeydown();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Simulating Fn key up...');
      await listener.simulateKeyup();
      
      // 9. Stop listener
      setTimeout(async () => {
        console.log('\n--- Stopping Listener ---');
        await listener.stop();
        console.log('Listener stopped');
        
        // 10. Cleanup
        console.log('\n--- Cleanup ---');
        listener.destroy();
        console.log('Example completed successfully!');
      }, 1000);
    }, 10000);

  } catch (error) {
    console.error('Example failed:', error);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners(listener) {
  console.log('--- Setting up Event Listeners ---');

  // State change events
  listener.on('state-change', (event) => {
    console.log(`🔄 State changed: ${event.oldState} → ${event.newState}`);
  });

  // Fn key events
  listener.on('fn-event', (event) => {
    console.log(`🎯 Fn event: ${event.event_type} (key: ${event.key_code})`);
  });

  // Specific key events
  listener.on('fn-keydown', (event) => {
    console.log(`⬇️  Fn key down at ${new Date(event.timestamp * 1000).toISOString()}`);
  });

  listener.on('fn-keyup', (event) => {
    console.log(`⬆️  Fn key up at ${new Date(event.timestamp * 1000).toISOString()}`);
  });

  // Permission change events
  listener.on('permission-change', (event) => {
    console.log(`🔐 Permission changed: ${event.hasPermission ? 'granted' : 'denied'}`);
  });

  // Listener start/stop events
  listener.on('listener-start', () => {
    console.log('🚀 Listener started');
  });

  listener.on('listener-stop', () => {
    console.log('🛑 Listener stopped');
  });

  // Error events
  listener.on('error', (error) => {
    console.error('❌ Listener error:', error.message);
  });
}

/**
 * Event parsing examples
 */
function eventParsingExample() {
  console.log('\n--- Event Parsing Examples ---');

  const { parseEvent } = require('../lib/utils');

  // Valid event messages
  const validMessages = [
    'keydown:63:1234567890.123',
    'keyup:63:1234567890.456'
  ];

  validMessages.forEach(message => {
    try {
      const event = parseEvent(message);
      console.log(`✅ Parsed "${message}":`, event);
    } catch (error) {
      console.log(`❌ Failed to parse "${message}":`, error.message);
    }
  });

  // Invalid event messages
  const invalidMessages = [
    'invalid:message:format',
    'keydown:abc:123',
    'keydown:63',
    ''
  ];

  invalidMessages.forEach(message => {
    try {
      const event = parseEvent(message);
      console.log(`✅ Parsed "${message}":`, event);
    } catch (error) {
      console.log(`❌ Failed to parse "${message}":`, error.message);
    }
  });
}

/**
 * Error handling examples
 */
function errorHandlingExample() {
  console.log('\n--- Error Handling Examples ---');

  const { createError } = require('../lib/errors');

  // Create different types of errors
  const errors = [
    createError.permission('Custom permission error'),
    createError.listenerAlreadyRunning(),
    createError.listenerNotRunning(),
    createError.nativeModule('Custom native module error'),
    createError.eventParse('Custom event parse error')
  ];

  errors.forEach((error, index) => {
    console.log(`Error ${index + 1}:`, {
      name: error.name,
      type: error.type,
      message: error.message
    });
  });
}

// Run example
if (require.main === module) {
  // Run helper examples first
  eventParsingExample();
  errorHandlingExample();
  
  // Then run main example
  setTimeout(() => {
    advancedUsageExample();
  }, 1000);
}

module.exports = {
  advancedUsageExample,
  setupEventListeners,
  eventParsingExample,
  errorHandlingExample
}; 