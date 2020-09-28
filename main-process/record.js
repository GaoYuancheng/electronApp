const { BrowserWindow, screen } = require("electron");
const { debug } = require("../utils");
let recordWin = null;

const os = require("os");

const recordStart = () => {
  if (recordWin) {
    return;
  }
  console.log("recordWin");
  let { width, height } = screen.getPrimaryDisplay().bounds;
  recordWin = new BrowserWindow({
    // window 使用 fullscreen,  mac 设置为 undefined, 不可为 false
    fullscreen: os.platform() === "win32" || undefined, // win
    width: debug ? 1000 : width,
    height: debug ? 1000 : height,
    // width,
    // height,
    x: 0,
    y: debug ? 30 : 0,
    transparent: !debug,
    frame: debug,
    skipTaskbar: !debug,
    autoHideMenuBar: !debug,
    movable: debug,
    resizable: debug,
    enableLargerThanScreen: true, // mac
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  recordWin.setAlwaysOnTop(true, "screen-saver"); // mac
  recordWin.setVisibleOnAllWorkspaces(true); // mac
  recordWin.setFullScreenable(false); // mac

  recordWin.loadURL(
    require("url").format({
      pathname: require("path").join(__dirname, "../asserts/record.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  if (debug) {
    // 打开调试
    recordWin.webContents.openDevTools();
  }

  recordWin.on("closed", () => {
    recordWin = null;
  });
};

// 按下esc键
const closeRecordWin = () => {
  if (recordWin) {
    recordWin.close();
    recordWin = null;
  }
};

const saveRecord = (e, blobs) => {
  console.log("saveRecord", blobs);

  // const toArrayBuffer = (blob, cb) => {
  //   const fileReader = new FileReader();
  //   fileReader.onload = function () {
  //     const arrayBuffer = this.result;
  //     cb(arrayBuffer);
  //   };
  //   fileReader.readAsArrayBuffer(blob);
  // };
  // const toBuffer = (ab) => {
  //   const buffer = new Buffer(ab.byteLength);
  //   const arr = new Uint8Array(ab);
  //   for (let i = 0; i < arr.byteLength; i++) {
  //     buffer[i] = arr[i];
  //   }
  //   return buffer;
  // };
  // console.log(new Blob([blobs], { type: "video/webm" }));
  // toArrayBuffer(new Blob(blobs, { type: "video/webm" }), (chunk) => {
  //   const buffer = toBuffer(chunk);
  //   fs.writeFile("screen-captures/record.mp4", buffer, function (err) {
  //     console.log("err", err);
  //   });
  // });
};

module.exports = {
  saveRecord,
  closeRecordWin,
  recordStart,
};
