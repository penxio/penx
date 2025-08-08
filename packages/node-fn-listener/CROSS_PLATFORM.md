# Cross-Platform Compatibility Solution

This document explains how the `node-fn-listener` package handles cross-platform compatibility.

## Problem

The original package was Mac-only and would fail to install on Windows and Linux systems with native compilation errors, preventing the entire application from installing.

## Solution Overview

We've implemented a graceful cross-platform approach that:

1. **Builds successfully on all platforms** without breaking the installation process
2. **Provides full functionality on macOS** with native Swift implementation
3. **Provides stub implementation on other platforms** that maintains API compatibility
4. **Gives clear feedback** about platform capabilities to developers

## Technical Implementation

### 1. Platform Detection in Build System (`binding.gyp`)

```javascript
{
  "targets": [
    {
      "target_name": "node_fn_listener",
      "conditions": [
        ['OS=="mac"', {
          // Full implementation with Swift library
          "sources": ["src/native/fn-listener.cpp"],
          // ... macOS-specific build configuration
        }, {
          // Stub implementation for other platforms
          "sources": ["src/native/stub.cpp"],
        }]
      ]
    }
  ]
}
```

### 2. Stub Implementation (`src/native/stub.cpp`)

For non-Mac platforms, we provide a native module that:
- Exports the same API as the full implementation
- Returns appropriate fallback values (e.g., `false` for boolean operations)
- Prevents runtime errors while maintaining API compatibility

### 3. Platform-Aware JavaScript Layer

The main implementation (`lib/impl.js`) now:
- Detects platform compatibility during initialization
- Shows appropriate warnings for unsupported platforms
- Gracefully handles method calls on unsupported platforms
- Provides detailed compatibility information via the `compatibility` property

### 4. Installation Scripts

**Pre-install check (`scripts/check-platform.js`)**:
- Displays platform compatibility information during installation
- Informs users about available features on their platform
- Provides clear expectations for functionality

**Graceful build process**:
```json
{
  "install": "node-gyp rebuild || echo \"Build failed, but continuing with stub implementation\""
}
```

## Platform Support Matrix

| Platform | Support Level | Fn Key Listening | Key Simulation | Accessibility Permissions |
|----------|---------------|------------------|----------------|---------------------------|
| **macOS** | ✅ Full | ✅ Yes | ✅ Yes | ✅ Yes |
| **Windows** | ⚠️ Limited | ❌ No | ❌ No | ❌ No |
| **Linux** | ⚠️ Limited | ❌ No | ❌ No | ❌ No |

## API Behavior on Different Platforms

### macOS (Full Support)
- All methods work as documented
- Native Swift implementation provides real functionality
- Accessibility permissions can be requested and checked
- Function key events are captured and simulated

### Windows/Linux (Stub Implementation)
- `start()` → Returns `false`, logs warning
- `stop()` → Returns `false`
- `checkPermission()` → Returns `false`
- `requestPermission()` → Returns `false`
- `simulateKeydown()/simulateKeyup()` → Returns `false`
- `fnPressed` → Returns `false`
- `fnKeyCode` → Returns `63` (default)
- `listening` → Returns `false`

## Usage Examples

### Cross-Platform Safe Usage

```javascript
import NodeFnListener, { checkCompatibility } from 'node-fn-listener';

// Check platform capabilities
const compatibility = checkCompatibility();
console.log('Platform:', compatibility.platformName);
console.log('Fn key listening supported:', compatibility.supportedFeatures.fnKeyListening);

// Create instance (works on all platforms)
const fnListener = new NodeFnListener();

// Check if functionality is available before using
if (fnListener.compatibility.isSupported) {
  // Safe to use full functionality
  const success = await fnListener.start((message) => {
    console.log('Fn key event:', message);
  });
} else {
  console.log('Fn key listening not available on this platform');
  // Implement alternative behavior or graceful degradation
}
```

### Graceful Degradation Pattern

```javascript
class MyApp {
  constructor() {
    this.fnListener = new NodeFnListener();
    this.setupFnKeyListening();
  }

  async setupFnKeyListening() {
    if (this.fnListener.compatibility.supportedFeatures.fnKeyListening) {
      // Full functionality on macOS
      const success = await this.fnListener.start(this.handleFnKey.bind(this));
      if (success) {
        console.log('Fn key listening active');
      }
    } else {
      // Alternative input method on other platforms
      console.log('Using keyboard shortcuts instead of Fn key');
      this.setupKeyboardShortcuts();
    }
  }

  handleFnKey(message) {
    // Handle Fn key events on macOS
  }

  setupKeyboardShortcuts() {
    // Alternative implementation for Windows/Linux
  }
}
```

## Benefits

1. **Universal Installation**: Package installs successfully on all platforms
2. **API Consistency**: Same API available everywhere, no conditional imports needed
3. **Clear Expectations**: Developers know exactly what works where
4. **Graceful Degradation**: Applications can provide alternative functionality
5. **Development Friendly**: No need for platform-specific build processes
6. **Maintenance Friendly**: Single codebase with clear separation of concerns

## Testing

The solution has been tested to ensure:
- ✅ Successful installation on macOS with full functionality
- ✅ Platform detection works correctly
- ✅ API remains consistent across platforms
- ✅ Graceful error handling for unsupported operations
- ✅ Clear logging and feedback for developers

## Future Improvements

While the current solution provides excellent cross-platform compatibility, future versions could potentially add:

1. **Windows Support**: Implement Windows-specific key listening using Win32 APIs
2. **Linux Support**: Implement Linux-specific key listening using X11 or Wayland
3. **Enhanced Feedback**: More detailed capability reporting
4. **Runtime Detection**: Dynamic feature detection based on system capabilities

This solution ensures that `node-fn-listener` can be safely included in cross-platform projects without breaking the development workflow on any platform. 