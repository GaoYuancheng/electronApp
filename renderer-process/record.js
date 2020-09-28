const { remote, ipcRenderer } = require("electron");
let { width, height } = remote.screen.getPrimaryDisplay().bounds;

let canvas = document.getElementById("canvas");
let sizeInfo = document.getElementById("sizeInfo");
let tools = document.getElementById("tools");
let closeBtn = document.getElementById("closeBtn");
let stopBtn = document.getElementById("stopBtn");
let startBtn = document.getElementById("startBtn");

let screenWidth = document.body.offsetWidth;
let screenHeight = document.body.offsetHeight;
console.log(screenHeight, screenWidth);

canvas.width = screenWidth;
canvas.height = screenHeight;
let ctx = canvas.getContext("2d");
let mouseHasDownInCanvas = false;
let x,
  y,
  w,
  h = 0;
let no = 1;
// 视屏数据
let blobs = [];
let tracks;
let recorder;
let timer;

// 开始移动
let moveStart = false;

// 渲染 tools 工具栏
const renderTools = () => {
  tools.style.display = "block";
  tools.style.top = `${y + h + 15}px`;
  tools.style.left = `${x}px`;
  tools.style.width = `${w + 20}px`;
};

// 渲染 size 信息
const renderSize = () => {
  sizeInfo.style.display = "block";
  sizeInfo.innerText = `${w} * ${h}`;
  if (y > 35) {
    sizeInfo.style.top = `${y - 30}px`;
    sizeInfo.style.left = `${x}px`;
  } else {
    sizeInfo.style.top = `${y + 5}px`;
    sizeInfo.style.left = `${x + 5}px`;
  }
};

const onMousedown = (e) => {
  const { offsetX, offsetY } = e;
  mouseHasDownInCanvas = true;
  moveStart = true;
  // console.log(offsetX, offsetY);
  x = offsetX;
  y = offsetY;
};

const onMouseMove = (e) => {
  if (moveStart) {
    clear(canvas);
    const { offsetX, offsetY } = e;
    w = offsetX - x;
    h = offsetY - y;
    drawRect(x, y, w, h);
    renderSize();
  }
};

const onMouseup = () => {
  if (mouseHasDownInCanvas && moveStart) {
    mouseHasDownInCanvas = false;
    moveStart = false;
    renderTools();
  }
};

// 清除画布
const clear = (canvas) => {
  canvas.height += 1;
  canvas.height -= 1;
};

const drawRect = (x, y, w, h) => {
  // console.log(x, y, w, h);
  ctx.rect(x, y, w, h);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
};

const { desktopCapturer } = require("electron");
const getScreenRecord = () => {
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      // 切换 录制/停止 图标
      startBtn.style.display = "none";
      stopBtn.style.display = "flex";

      for (const source of sources) {
        if (source.name === "Entire Screen") {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              // audio: {
              //   mandatory: {
              //     chromeMediaSource: "desktop",
              //     chromeMediaSourceId: source.id,
              //     minWidth: 0,
              //     maxWidth: width,
              //     minHeight: 0,
              //     maxHeight: height,
              //   },
              // },
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: source.id,
                  minWidth: 0,
                  maxWidth: width,
                  minHeight: 0,
                  maxHeight: height,
                },
              },
            });
            handleStream(stream);
          } catch (e) {
            console.log(e);
          }
          return;
        }
      }
    });

  const handleImage = (ctx, imageCapture) => {
    imageCapture.grabFrame().then((imageBitmap) => {
      no += 1;
      console.log(no, "handleImage");
      // ctx.clearRect(
      //   0,
      //   0,
      //   this.arean.width,
      //   this.arean.height,
      // )
      ctx.drawImage(imageBitmap, x, y, w, h, 0, 0, w, h);
      console.log(x, y, w, h);
      timer = setTimeout(function () {
        handleImage(ctx, imageCapture);
      }, 0);
    });
  };

  const handleStream = (stream) => {
    if (!stream) return;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    tracks = stream.getTracks();

    const screenVideoTrack = stream.getVideoTracks()[0];
    // const screenAudioTrack = stream.getAudioTracks()[0];
    const imageCapture = new ImageCapture(screenVideoTrack);

    handleImage(ctx, imageCapture);
    const options = {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 250000000,
      mimeType: "video/webm",
    };
    const canvasStream = canvas.captureStream(100);
    // const canvasVideoTrack = canvasStream.getVideoTracks()[0];

    // const mediaStream = new MediaStream([canvasVideoTrack]);
    // recorder = new MediaRecorder(mediaStream, options);
    recorder = new MediaRecorder(canvasStream, options);
    blobs = [];
    recorder.ondataavailable = function (event) {
      blobs.push(event.data);
    };
    recorder.start();
  };
};

const closeWin = () => {
  ipcRenderer.send("close-record-win");
};

const savaRecord = () => {
  //  blobs 参数不能传递给主进程
  const toArrayBuffer = (blob, cb) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const arrayBuffer = this.result;
      cb(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
  };
  const toBuffer = (ab) => {
    const buffer = Buffer.alloc(ab.byteLength);
    const arr = new Uint8Array(ab);
    for (let i = 0; i < arr.byteLength; i++) {
      buffer[i] = arr[i];
    }
    return buffer;
  };
  // const exec = window.require("child_process").exec;
  const fs = window.require("fs");
  const path = window.require("path");
  // const wembPath = path.join(__dirname, "../screen-captures/record.webm");
  const mp4Path = path.join(__dirname, "../screen-captures/record.webm");

  // 切换 录制/停止 图标
  startBtn.style.display = "flex";
  stopBtn.style.display = "none";

  toArrayBuffer(new Blob(blobs, { type: "video/webm" }), (chunk) => {
    const buffer = toBuffer(chunk);
    fs.writeFile(mp4Path, buffer, function (err) {
      console.log("err", err);
    });
  });
};

const stopRecord = () => {
  recorder.onstop = () => {
    // console.log("save-record", JSON.stringify(blobs));
    // ipcRenderer.send("save-record", blobs);
    savaRecord();
  };
  clearTimeout(timer);
  recorder.stop();
  tracks.forEach((track) => track.stop());
};

canvas.addEventListener("mousedown", onMousedown);
canvas.addEventListener("mouseup", onMouseup);
canvas.addEventListener("mousemove", onMouseMove);
startBtn.addEventListener("click", getScreenRecord);
closeBtn.addEventListener("click", closeWin);
stopBtn.addEventListener("click", stopRecord);
// document
//   .getElementById("getDesktopCapturer")
//   .addEventListener("click", getDesktopCapturer);
window.onload = () => {
  console.log("ss");
};
