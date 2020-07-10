const {
  ipcMain,
  globalShortcut,
  clipboard,
  screen,
  BrowserWindow
} = require("electron");

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
    width: 100,
    height: 100,
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

  captureWin.loadFile("index.html");

  // 调试用
  // captureWin.openDevTools()

  captureWin.on("closed", () => {
    captureWin = null;
  });
};

ipcMain.on("start", start);
module.exports = start;
