const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { debug } = require("../utils");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      nodeIntegration: true,
    },
    // frame: false,
    // titleBarStyle: 'customButtonsOnHover'
  });

  // and load the index.html of the app.
  mainWindow.loadFile("./asserts/index.html");
  if (debug) {
    mainWindow.webContents.openDevTools();
  }

  // mainWindow.loadURL('http://local.alipay.net:8001');
}

app.whenReady().then(() => {
  createWindow();

  // 快捷键注册
  require("./keyboard");

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

const { saveImage, closeCaptureWin, captureStart } = require("./screen");
const { saveRecord, closeRecordWin, recordStart } = require("./record");

ipcMain.on("save-image", saveImage);
ipcMain.on("capture-start", captureStart);
ipcMain.on("close-capture-win", closeCaptureWin);

ipcMain.on("save-record", saveRecord);
ipcMain.on("record-start", recordStart);
ipcMain.on("close-record-win", closeRecordWin);

ipcMain.on("console-log", (e, arg) => {
  console.log(arg);
});
