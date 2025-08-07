#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Get Electron version
const electronVersion = require('electron/package.json').version;

console.log(`Rebuilding for Electron ${electronVersion}...`);

try {
  // Use @electron/rebuild to rebuild
  execSync(`npx @electron/rebuild --version=${electronVersion}`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  console.log('✅ Rebuild completed successfully');
} catch (error) {
  console.error('❌ Rebuild failed:', error.message);
  process.exit(1);
} 