const electron = require('electron'); 
var spawn = require('child_process').spawn;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680});
 
  mainWindow.loadURL(isDev ? 'http://localhost:5000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});



var child = spawn(electron, ['server.js'], {
  stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  // if you pass some value, even an empty object, 
  // the electron process will always exit immediately on linux, works fine in OSX
  env: {} 
});

child.on('exit', function() {
  console.log('child process exit..');
});

child.on('message', function (m) {
  console.log('yes it works');
});