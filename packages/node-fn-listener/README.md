# Node Fn Listener

Global fn key listener for Node.js and Electron applications.

## Features

- 🔥 **Global Fn Key Detection**: Listen to Fn key events globally across your system
- 🎯 **Event-Driven Architecture**: Built-in event system for easy integration
- 📝 **Comprehensive Logging**: Configurable logging system with multiple levels
- 🛡️ **Robust Error Handling**: Detailed error types and handling mechanisms
- 🔄 **State Management**: Clear state transitions and lifecycle management
- ⚡ **High Performance**: Native Swift implementation for optimal performance
- 🔧 **Configurable**: Flexible configuration options for different use cases
- 📱 **Electron Ready**: Works seamlessly in Electron applications
- 🍎 **macOS Optimized**: Native macOS integration with accessibility APIs

## Installation

```bash
npm install node-fn-listener
```

## Quick Start

### Basic Usage

```typescript
import NodeFnListener from 'node-fn-listener';

const fnListener = new NodeFnListener();

// Start listening for Fn key events
const success = await fnListener.start((message) => {
  console.log('Fn key event:', message);
  
  // Parse the event
  const event = fnListener.parseEvent(message);
  if (event) {
    console.log('Event type:', event.event_type);
    console.log('Key code:', event.key_code);
    console.log('Timestamp:', event.timestamp);
  }
});

if (success) {
  console.log('Started listening for Fn key events');
} else {
  console.error('Failed to start listening');
}
```

### Electron Integration

```typescript
import { app } from 'electron';
import NodeFnListener from 'node-fn-listener';

app.whenReady().then(() => {
  const fnListener = new NodeFnListener();
  
  // Check permission
  if (!fnListener.checkPermission()) {
    console.log('Accessibility permission required');
    fnListener.requestPermission();
  }
  
  // Start listening
  fnListener.start((message) => {
    const event = NodeFnListener.parseEvent(message);
    if (event?.event_type === 'keydown') {
      console.log('Fn key pressed!');
      // Handle Fn key press
    }
  });
});
```

## API Reference

### NodeFnListener

#### Methods

- `start(callback: FnCallback): Promise<boolean>` - Start listening for Fn key events
- `stop(): Promise<boolean>` - Stop listening for Fn key events
- `requestPermission(): Promise<boolean>` - Request accessibility permission
- `checkPermission(): boolean` - Check if accessibility permission is granted
- `simulateKeydown(): Promise<boolean>` - Simulate Fn key press
- `simulateKeyup(): Promise<boolean>` - Simulate Fn key release
- `parseEvent(message: string): FnEvent | null` - Parse event message

#### Properties

- `listening: boolean` - Current listening status
- `fnKeyCode: number` - Fn key code (usually 63)
- `fnPressed: boolean` - Whether Fn key is currently pressed

#### Static Methods

- `NodeFnListener.parseEvent(message: string): FnEvent | null` - Parse event message

### Types

```typescript
interface FnEvent {
  event_type: 'keydown' | 'keyup';
  key_code: number;
  timestamp: number;
  is_pressed: boolean;
}

type FnCallback = (message: string) => void;
```

## Development

### Prerequisites

- Node.js >= 14.0.0
- macOS (for native functionality)
- Xcode Command Line Tools

### Setup

```bash
# Install dependencies
npm install

# Build native module
npm run build

# Build for Electron
npm run build:electron

```

### Testing

```bash
# Run basic tests
npm test

# Run callback tests
npm run test:callback

# Run detailed tests
npm run test:detailed

```

### Examples

```bash
# Run basic example
npm run example

# Run Electron example
npm run example:electron
```

## Building

### For Node.js

```bash
npm run build
```

### For Electron

```bash
npm run build:electron
```

The module will be automatically rebuilt for the correct Node.js version when installed.

## Troubleshooting

### Permission Issues

If you encounter permission issues:

1. Go to System Preferences > Security & Privacy > Privacy > Accessibility
2. Add your application to the list
3. Restart your application

### Build Issues

If you encounter build issues:

1. Ensure Xcode Command Line Tools are installed
2. Run `npm run clean` to clean build artifacts
3. Run `npm run build` to rebuild

### Electron Integration

For Electron applications, ensure the module is rebuilt for the correct Electron version:

```bash
ELECTRON_VERSION=37.2.5 npm run build:electron
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request
