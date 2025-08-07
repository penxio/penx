const NodeFnListener = require('../index.js');

async function callbackTest() {
    const fnListener = new NodeFnListener();

    console.log('=== Callback Test ===');
    console.log('Fn Key Code:', fnListener.fnKeyCode);
    console.log('Permission status:', fnListener.checkPermission());

    // Define callback function
    const callback = (message) => {
        console.log('Callback received:', message);
        
        // Parse event
        const event = fnListener.parseEvent(message);
        if (event) {
            console.log('Parsed event:', event);
        }
    };

    const success = await fnListener.start(callback);

    if (success) {
        console.log('✅ Listener started successfully');
        
        // Wait for some time to let callback work
        setTimeout(async () => {
            console.log('Stopping listener...');
            await fnListener.stop();
            console.log('Test completed');
            process.exit(0);
        }, 5000);
    } else {
        console.error('❌ Failed to start listener');
        process.exit(1);
    }
}

callbackTest().catch(console.error); 