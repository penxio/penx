#!/usr/bin/env node

const os = require('os');

/**
 * Check platform compatibility before installation
 */
function checkPlatform() {
  const platform = process.platform;
  const arch = process.arch;
  const platformName = {
    'win32': 'Windows',
    'darwin': 'macOS',
    'linux': 'Linux',
    'freebsd': 'FreeBSD',
    'openbsd': 'OpenBSD'
  }[platform] || platform;

  console.log(`\n🔍 Checking platform compatibility...`);
  console.log(`Platform: ${platformName} (${platform})`);
  console.log(`Architecture: ${arch}`);
  console.log(`Node.js version: ${process.version}`);

  if (platform === 'darwin') {
    console.log(`✅ Full functionality available on macOS`);
    console.log(`   - Function key listening: ✅ Supported`);
    console.log(`   - Key simulation: ✅ Supported`);
    console.log(`   - Accessibility permissions: ✅ Supported`);
  } else {
    console.log(`⚠️  Limited functionality on ${platformName}`);
    console.log(`   - Function key listening: ❌ Not supported`);
    console.log(`   - Key simulation: ❌ Not supported`);
    console.log(`   - Accessibility permissions: ❌ Not supported`);
    console.log(`\n📝 Note: The package will install with stub implementations.`);
    console.log(`   All methods will be available but will return appropriate`);
    console.log(`   fallback values. This allows your code to run without`);
    console.log(`   modification across platforms.`);
  }

  console.log(`\n📦 Proceeding with installation...\n`);
}

// Only run if this script is executed directly
if (require.main === module) {
  checkPlatform();
}

module.exports = { checkPlatform }; 