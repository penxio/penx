const NodeFnListener = require('../index.js');

async function test() {
    const fnListener = new NodeFnListener();

    console.log('=== Node Fn Listener Test (Swift Implementation) ===');
    console.log('Fn Key Code:', fnListener.fnKeyCode);
    console.log('Permission status:', fnListener.checkPermission());

    // Test simulation functionality
    console.log('\n=== Testing Swift Implementation ===');
    const simSuccess = await fnListener.start((message) => {
        console.log('Received event:', message);
    });

    if (simSuccess) {
        console.log('Started listening, testing simulation...');
        
        // Simulate fn key down
        await fnListener.simulateKeydown();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Simulate fn key up
        await fnListener.simulateKeyup();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await fnListener.stop();
        console.log('Test completed successfully');
    } else {
        console.error('Failed to start listening');
    }
}

test().catch(console.error); 