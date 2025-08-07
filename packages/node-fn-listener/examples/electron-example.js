const { app, BrowserWindow, ipcMain } = require('electron');
const NodeFnListener = require('../index.js');

let mainWindow;
let fnListener;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // Open developer tools
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupFnListener() {
  // Initialize fn listener
  fnListener = new NodeFnListener();

  // Check permission
  if (!fnListener.checkPermission()) {
    console.log('⚠️  Accessibility permission required to listen for fn key');
    console.log('Please add this app in System Preferences > Security & Privacy > Privacy > Accessibility');
    return;
  }

  // Start listening for fn key
  fnListener.start((message) => {
    console.log('Fn key event:', message);
    
    // Parse event
    const event = fnListener.parseEvent(message);
    if (event) {
      console.log('Parsed event:', event);
      
      // Send event to renderer process
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('fn-event', event);
      }
      
      // Send event to renderer process
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('fn-raw-message', message);
      }
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  setupFnListener();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (fnListener) {
    fnListener.stop();
  }
}); 