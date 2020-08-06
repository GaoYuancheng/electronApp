const fs = require("fs");
const { BrowserWindow, screen } = require("electron");
const { debug } = require("../utils");
let captureWin = null;

const os = require("os");

const captureStart = () => {
  if (captureWin) {
    return;
  }
  console.log("captureWin");
  let { width, height } = screen.getPrimaryDisplay().bounds;
  captureWin = new BrowserWindow({
    // window 使用 fullscreen,  mac 设置为 undefined, 不可为 false
    fullscreen: os.platform() === "win32" || undefined, // win
    width: debug ? 1000 : width,
    height: debug ? 1000 : height,
    // width,
    // height,
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
    webPreferences: {
      nodeIntegration: true,
    },
  });
  captureWin.setAlwaysOnTop(true, "screen-saver"); // mac
  captureWin.setVisibleOnAllWorkspaces(true); // mac
  captureWin.setFullScreenable(false); // mac

  captureWin.loadURL(
    require("url").format({
      pathname: require("path").join(__dirname, "../asserts/screen.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  if (debug) {
    // 打开调试
    captureWin.webContents.openDevTools();
  }

  captureWin.on("closed", () => {
    captureWin = null;
  });
};

// 按下esc键
const closeCaptureWin = () => {
  if (captureWin) {
    captureWin.close();
    captureWin = null;
  }
};

const saveImage = (e, imgUrl) => {
  console.log("savaImagfe");
  let base64Data = imgUrl.replace(/^data:image\/\w+;base64,/, "");
  let dataBuffer = Buffer.from(base64Data, "base64");
  fs.writeFile("screen-captures/out.png", dataBuffer, () => {});
};

module.exports = {
  saveImage,
  closeCaptureWin,
  captureStart,
};
