const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      nodeIntegration: true
    }
    // frame: false,
    // titleBarStyle: 'customButtonsOnHover'
  });

  // and load the index.html of the app.
  mainWindow.loadFile("./asserts/index.html");
  const debug = /--debug/.test(process.argv[2]);
  if (debug) {
    mainWindow.webContents.openDevTools();
  }

  // mainWindow.loadURL('http://local.alipay.net:8001');
}

app.whenReady().then(() => {
  createWindow();

  // 快捷键注册
  require("./keyboard");

  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

const { start } = require("./record");
const { saveImage } = require("./screen");

ipcMain.on("start", start);
ipcMain.on("save-image", saveImage);
