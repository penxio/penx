const NodeFnListener = require('../index.js');

async function basicExample() {
  console.log('=== Basic Node Fn Listener Example ===');

  const listener = new NodeFnListener();

  // Start listening for fn key
  const success = await listener.start((message) => {
    console.log('Raw message:', message);
    
    // Parse event
    const event = listener.parseEvent(message);
    if (event) {
      console.log('Parsed event:', event);
    }
  });

  if (success) {
    console.log('✅ Listener started successfully');
    console.log('Fn Key Code:', listener.fnKeyCode);
    console.log('Permission status:', listener.checkPermission());

    // Listen for state changes
    listener.on('state-change', (event) => {
      console.log('State changed:', event.oldState, '→', event.newState);
    });

    listener.on('fn-event', (event) => {
      console.log('Fn event:', event);
    });

    // Stop listening after 10 seconds
    setTimeout(async () => {
      console.log('Stopping listener...');
      await listener.stop();
      console.log('Listener stopped');
      process.exit(0);
    }, 10000);

  } else {
    console.log('❌ Failed to start listener');
    process.exit(1);
  }
}

// Run example
basicExample().catch(console.error); 