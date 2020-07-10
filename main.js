const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  ipcMain,
  screen
} = require("electron");
const path = require("path");

let mainWindow;
let captureWin = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true
    }
    // frame: false,
    // titleBarStyle: 'customButtonsOnHover'
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  const debug = /--debug/.test(process.argv[2]);
  if (debug) {
    mainWindow.webContents.openDevTools();
  }

  // mainWindow.loadURL('http://local.alipay.net:8001');
}

app.whenReady().then(() => {
  createWindow();
  globalShortcut.register("Esc", () => {
    if (captureWin) {
      captureWin.close();
      captureWin = null;
    }
    console.log("sss");
  });

  // require("./main-process/keyboard");

  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

const os = require("os");

// const start = (event, arg) => {
//   console.log(arg, screen); // prints "ping"
// };

const start = (e, args) => {
  if (captureWin) {
    return;
  }
  console.log("captureWin");
  let { width, height } = screen.getPrimaryDisplay().bounds;
  captureWin = new BrowserWindow({
    // window 使用 fullscreen,  mac 设置为 undefined, 不可为 false
    fullscreen: os.platform() === "win32" || undefined, // win
    width,
    height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    skipTaskbar: true,
    autoHideMenuBar: true,
    movable: false,
    resizable: false,
    enableLargerThanScreen: true, // mac
    hasShadow: false
  });
  captureWin.setAlwaysOnTop(true, "screen-saver"); // mac
  captureWin.setVisibleOnAllWorkspaces(true); // mac
  captureWin.setFullScreenable(false); // mac

  captureWin.loadFile("screen.html");

  // 调试用
  // captureWin.openDevTools()

  captureWin.on("closed", () => {
    captureWin = null;
  });
};

ipcMain.on("start", start);
