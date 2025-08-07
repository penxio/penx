const NodeFnListener = require('../index.js');
const { Logger, LOG_LEVELS, LISTENER_STATES, EVENT_TYPES } = require('../index.js');

async function runAdvancedTest() {
  console.log('=== Advanced Node Fn Listener Test ===');

  // Create custom logger
  const logger = new Logger({
    level: LOG_LEVELS.DEBUG,
    prefix: '[Test]',
    enabled: true
  });

  // Create listener instance
  const listener = new NodeFnListener({
    logger,
    LISTENER_CONFIG: {
      autoRetry: true,
      retryInterval: 500,
      maxRetries: 2
    }
  });

  try {
    // Test event listeners
    listener.on('state-change', (event) => {
      console.log('State changed:', event.oldState, '->', event.newState);
    });

    listener.on('fn-event', (event) => {
      console.log('Fn event received:', event);
    });

    listener.on('fn-keydown', (event) => {
      console.log('Fn keydown event:', event);
    });

    listener.on('fn-keyup', (event) => {
      console.log('Fn keyup event:', event);
    });

    listener.on('error', (error) => {
      console.error('Listener error:', error);
    });

    // Test basic functionality
    console.log('\n--- Basic Functionality Test ---');
    console.log('Current state:', listener.currentState);
    console.log('Fn Key Code:', listener.fnKeyCode);
    console.log('Permission status:', listener.checkPermission());

    // Test permission request
    console.log('\n--- Permission Test ---');
    const permissionGranted = await listener.requestPermission();
    console.log('Permission granted:', permissionGranted);

    if (!permissionGranted) {
      console.log('⚠️  Permission denied, skipping listener test');
      return;
    }

    // Test listener start
    console.log('\n--- Listener Start Test ---');
    const startSuccess = await listener.start((message) => {
      console.log('Raw message received:', message);
    });

    if (startSuccess) {
      console.log('✅ Listener started successfully');
      console.log('Current state:', listener.currentState);
      console.log('Listening status:', listener.listening);

      // Wait for listener to stabilize
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test simulation
      console.log('\n--- Simulation Test ---');
      console.log('Simulating Fn key down...');
      const keydownSuccess = await listener.simulateKeydown();
      console.log('Keydown simulation result:', keydownSuccess);

      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('Simulating Fn key up...');
      const keyupSuccess = await listener.simulateKeyup();
      console.log('Keyup simulation result:', keyupSuccess);

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test listener stop
      console.log('\n--- Listener Stop Test ---');
      const stopSuccess = await listener.stop();
      console.log('Stop result:', stopSuccess);
      console.log('Current state:', listener.currentState);
      console.log('Listening status:', listener.listening);

      // Test event parsing
      console.log('\n--- Event Parsing Test ---');
      const testMessage = 'keydown:63:1234567890.123';
      const parsedEvent = listener.parseEvent(testMessage);
      console.log('Parsed event:', parsedEvent);

      // Test error handling
      console.log('\n--- Error Handling Test ---');
      try {
        const invalidEvent = listener.parseEvent('invalid:message:format');
        console.log('Invalid event result:', invalidEvent);
      } catch (error) {
        console.log('Expected error caught:', error.message);
      }

      // Test destroy
      console.log('\n--- Destroy Test ---');
      listener.destroy();
      console.log('Listener destroyed');

    } else {
      console.log('❌ Failed to start listener');
    }

  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run test
runAdvancedTest().catch(console.error); 