const path = require('path');
const fs = require('fs');
const { EVENT_TYPES, DEFAULT_CONFIG } = require('../constants');
const { createError } = require('../errors');

/**
 * Parse event message
 * @param {string} message - Event message
 * @returns {Object|null} Parsed event object
 */
function parseEvent(message) {
  if (!message || typeof message !== 'string') {
    throw createError.eventParse('Invalid message format');
  }

  const parts = message.split(':');
  if (parts.length < 3) {
    throw createError.eventParse(`Invalid message format: ${message}`);
  }

  const [eventType, keyCodeStr, timestampStr] = parts;
  
  // Validate event type
  if (!Object.values(EVENT_TYPES).includes(eventType)) {
    throw createError.eventParse(`Invalid event type: ${eventType}`);
  }

  // Parse key code
  const keyCode = parseInt(keyCodeStr, 10);
  if (isNaN(keyCode)) {
    throw createError.eventParse(`Invalid key code: ${keyCodeStr}`);
  }

  // Parse timestamp
  const timestamp = parseFloat(timestampStr);
  if (isNaN(timestamp)) {
    throw createError.eventParse(`Invalid timestamp: ${timestampStr}`);
  }

  return {
    event_type: eventType,
    key_code: keyCode,
    timestamp: timestamp,
    is_pressed: eventType === EVENT_TYPES.KEYDOWN
  };
}

/**
 * Validate event object
 * @param {Object} event - Event object
 * @returns {boolean} Whether valid
 */
function validateEvent(event) {
  return event && 
         typeof event === 'object' &&
         typeof event.event_type === 'string' &&
         typeof event.key_code === 'number' &&
         typeof event.timestamp === 'number' &&
         typeof event.is_pressed === 'boolean';
}

/**
 * Format event message
 * @param {Object} event - Event object
 * @returns {string} Formatted event message
 */
function formatEventMessage(event) {
  if (!validateEvent(event)) {
    throw createError.eventParse('Invalid event object');
  }

  return `${event.event_type}:${event.key_code}:${event.timestamp}`;
}

/**
 * Dynamically find static library path
 * @returns {string|null} Static library path
 */
function findStaticLibrary() {
  const possiblePaths = [
    // Paths relative to current module
    path.join(__dirname, '..', '..', 'build', 'Release', 'libfn_listener.a'),
    path.join(__dirname, '..', '..', 'libfn_listener.a'),
    
    // Paths relative to working directory
    path.join(process.cwd(), 'build', 'Release', 'libfn_listener.a'),
    path.join(process.cwd(), 'libfn_listener.a'),
    path.join(process.cwd(), '..', 'libfn_listener.a'),
    path.join(process.cwd(), '..', '..', 'packages', 'node-fn-listener', 'build', 'Release', 'libfn_listener.a'),
    
    // Electron app paths
    path.join(process.cwd(), '..', '..', '..', 'apps', 'electron', 'libfn_listener.a'),
    
    // System paths
    '/usr/local/lib/libfn_listener.a',
    '/opt/homebrew/lib/libfn_listener.a'
  ];

  for (const libPath of possiblePaths) {
    if (fs.existsSync(libPath)) {
      return libPath;
    }
  }

  return null;
}

/**
 * Set environment variables to help dynamic library find static library
 */
function setupLibraryPath() {
  const staticLibPath = findStaticLibrary();
  if (staticLibPath) {
    const libDir = path.dirname(staticLibPath);
    const currentPath = process.env.DYLD_LIBRARY_PATH || '';
    const newPath = currentPath ? `${currentPath}:${libDir}` : libDir;
    
    process.env.DYLD_LIBRARY_PATH = newPath;
    return staticLibPath;
  }
  
  return null;
}

/**
 * Check system compatibility
 * @returns {Object} Compatibility information
 */
function checkCompatibility() {
  const platform = process.platform;
  const arch = process.arch;
  
  return {
    platform,
    arch,
    isSupported: platform === 'darwin',
    isArm64: arch === 'arm64',
    isX64: arch === 'x64',
    supportedFeatures: {
      fnKeyListening: platform === 'darwin',
      fnKeySimulation: platform === 'darwin',
      accessibilityPermissions: platform === 'darwin'
    },
    platformName: {
      'win32': 'Windows',
      'darwin': 'macOS',
      'linux': 'Linux',
      'freebsd': 'FreeBSD',
      'openbsd': 'OpenBSD'
    }[platform] || platform
  };
}

/**
 * Delay function
 * @param {number} ms - Delay milliseconds
 * @returns {Promise} Promise object
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Promise object
 */
async function retry(fn, options = {}) {
  const { maxRetries = 3, delayMs = 1000, onRetry = null } = options;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      if (onRetry) {
        onRetry(error, attempt);
      }
      
      await delay(delayMs);
    }
  }
}

module.exports = {
  parseEvent,
  validateEvent,
  formatEventMessage,
  findStaticLibrary,
  setupLibraryPath,
  checkCompatibility,
  delay,
  retry
}; 