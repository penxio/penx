const NodeFnListener = require('../index.js');

async function debugTest() {
    const fnListener = new NodeFnListener();

    console.log('=== Debug Test ===');
    console.log('Fn Key Code:', fnListener.fnKeyCode);
    console.log('Permission status:', fnListener.checkPermission());

    // Define callback function
    const callback = (message) => {
        console.log('Debug callback received:', message);
        
        // Parse event
        const event = fnListener.parseEvent(message);
        if (event) {
            console.log('Debug parsed event:', event);
        }
    };

    const success = await fnListener.start(callback);

    if (success) {
        console.log('✅ Debug listener started successfully');
        
        // Test simulation
        setTimeout(async () => {
            console.log('Testing simulation...');
            await fnListener.simulateKeydown();
            await new Promise(resolve => setTimeout(resolve, 100));
            await fnListener.simulateKeyup();
            
            setTimeout(async () => {
                await fnListener.stop();
                console.log('Debug test completed');
                process.exit(0);
            }, 1000);
        }, 2000);
    } else {
        console.error('❌ Debug listener failed to start');
        process.exit(1);
    }
}

debugTest().catch(console.error); 