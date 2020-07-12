const { BrowserWindow, screen } = require("electron");
let captureWin = null;

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
    hasShadow: false,
  });
  captureWin.setAlwaysOnTop(true, "screen-saver"); // mac
  captureWin.setVisibleOnAllWorkspaces(true); // mac
  captureWin.setFullScreenable(false); // mac

  captureWin.loadFile("../asserts/screen.html");

  captureWin.on("closed", () => {
    captureWin = null;
  });
};

// 按下esc键
const pressEsc = () => {
  if (captureWin) {
    captureWin.close();
    captureWin = null;
  }
};

module.exports = {
  pressEsc,
  start,
};
