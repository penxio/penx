const NodeFnListener = require('../index.js');

async function detailedTest() {
    const fnListener = new NodeFnListener();

    console.log('=== Detailed Test ===');
    console.log('Fn Key Code:', fnListener.fnKeyCode);
    console.log('Permission status:', fnListener.checkPermission());

    // Define callback function
    const callback = (message) => {
        console.log('Detailed callback received:', message);
        
        // Parse event
        const event = fnListener.parseEvent(message);
        if (event) {
            console.log('Detailed parsed event:', {
                type: event.event_type,
                timestamp: event.timestamp,
                isPressed: event.is_pressed,
                keyCode: event.key_code,
            });
        }
    };

    const success = await fnListener.start(callback);

    if (success) {
        console.log('✅ Detailed listener started successfully');
        
        // Test simulation
        setTimeout(async () => {
            console.log('Testing simulation...');
            await fnListener.simulateKeydown();
            await new Promise(resolve => setTimeout(resolve, 100));
            await fnListener.simulateKeyup();
            
            setTimeout(async () => {
                await fnListener.stop();
                console.log('Detailed test completed');
                process.exit(0);
            }, 1000);
        }, 2000);
    } else {
        console.error('❌ Detailed listener failed to start');
        process.exit(1);
    }
}

detailedTest().catch(console.error); 