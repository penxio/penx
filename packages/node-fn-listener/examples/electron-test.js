const NodeFnListener = require('../index.js');

async function electronTest() {
    console.log('=== Electron Test ===');

    const fnListener = new NodeFnListener();

    console.log('Fn Key Code:', fnListener.fnKeyCode);
    console.log('Permission status:', fnListener.checkPermission());

    // Define callback function, simulating usage in Electron app
    const callback = (message) => {
        console.log('Electron callback received:', message);
        
        // Parse event
        const event = fnListener.parseEvent(message);
        if (event) {
            console.log('Electron parsed event:', event);
            
            if (event.event_type === 'keydown') {
                console.log('Fn key pressed in Electron!');
            } else if (event.event_type === 'keyup') {
                console.log('Fn key released in Electron!');
            }
        }
    };

    const success = await fnListener.start(callback);

    if (success) {
        console.log('✅ Electron listener started successfully');
        
        // Wait for some time to let callback work
        setTimeout(async () => {
            console.log('Stopping Electron listener...');
            await fnListener.stop();
            console.log('Electron test completed');
            process.exit(0);
        }, 5000);
    } else {
        console.error('❌ Electron listener failed to start');
        process.exit(1);
    }
}

electronTest().catch(console.error); 