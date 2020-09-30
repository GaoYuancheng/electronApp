const { initCanvas } = require("../renderer-process/canvas.js");
const { ipcRenderer, remote, nativeImage, clipboard } = require("electron");
let { width, height } = remote.screen.getPrimaryDisplay().bounds;

let canvas = document.getElementById("canvas");
let sizeInfo = document.getElementById("sizeInfo");
let tools = document.getElementById("tools");
let bgImg = document.getElementById("bgImg");
let screenWidth = document.body.offsetWidth;
let screenHeight = document.body.offsetHeight;

bgImg.width = width;
bgImg.height = height;
// let bgImgDiv = document.getElementById("bgImgDiv");

// document.body.style.maxHeight = height;
// document.body.style.maxWidth = width;

let screenImgData = "";

// 矩形尺寸
let x = 0,
  y = 0,
  w = 0,
  h = 0;

const setxywh = (x1, y1, w1, h1) => {
  x = x1;
  y = y1;
  w = w1;
  h = h1;
};

// 初始化canvas 以及工具栏
initCanvas(canvas, sizeInfo, tools, setxywh);

// const getPixelRatio = (context) => {
//   var backingStore =
//     context.backingStorePixelRatio ||
//     context.webkitBackingStorePixelRatio ||
//     context.mozBackingStorePixelRatio ||
//     context.msBackingStorePixelRatio ||
//     context.oBackingStorePixelRatio ||
//     context.backingStorePixelRatio ||
//     1;
//   return (window.devicePixelRatio || 1) / backingStore;
// };

// get 图片的url
const getImageUrl = (imageData) => {
  let _canvas = document.createElement("canvas");
  _canvas.width = w;
  _canvas.height = h;
  let _ctx = _canvas.getContext("2d");
  _ctx.putImageData(imageData, 0, 0);
  return _canvas.toDataURL();
};

const saveImage = (imgUrl) => {
  console.log("save", imgUrl);
  ipcRenderer.send("save-image", imgUrl);
};

const { desktopCapturer } = require("electron");
const drawBgImage = () => {
  desktopCapturer
    .getSources({
      types: ["screen"],
      // thumbnailSize: { width: 1, height: 1 },
    })
    .then(async (sources) => {
      for (const source of sources) {
        if (source.name === "Entire Screen") {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
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

  const handleStream = (stream) => {
    if (!stream) return;

    const video = document.createElement("video");

    video.height = screenHeight;
    video.width = screenWidth;

    let loaded = false;
    video.onloadedmetadata = () => {
      if (loaded) return;
      loaded = true;
      video.play();
      stream.getTracks()[0];

      const _canvas = document.createElement("canvas");

      const _ctx = _canvas.getContext("2d");

      // const ratio = getPixelRatio(_ctx);

      // _canvas.width = video.width * ratio;
      // _canvas.height = video.height * ratio;
      _canvas.width = video.width;
      _canvas.height = video.height;
      _canvas.style.width = `${video.width}px`;
      _canvas.style.height = `${video.height}px`;
      // console.log(video.width, video.height);

      // _ctx.scale(ratio, ratio);
      _ctx.drawImage(video, 0, 0, screenWidth, screenHeight);

      ipcRenderer.send("console-log", {
        screenWidth,
        screenHeight,
        // ratio,
        width,
      });

      bgImg.src = _canvas.toDataURL("image/png", 1);
      // console.log(screenWidth, screenWidth);
      screenImgData = _ctx.getImageData(0, 0, screenWidth, screenHeight);

      // document.body.appendChild(_canvas);

      ipcRenderer.send("console-log", "ok");
    };

    video.srcObject = stream;
  };
};

// 关闭窗口
const closeWin = () => {
  ipcRenderer.send("close-capture-win");
};

// 截图 保存文件
const getCaptureImage = () => {
  const _canvas = document.createElement("canvas");
  const _ctx = _canvas.getContext("2d");
  _canvas.width = screenWidth;
  _canvas.height = screenHeight;
  _ctx.putImageData(screenImgData, 0, 0);

  // document.body.appendChild(_canvas);

  const imageData = _ctx.getImageData(x, y, w, h);

  // 复制到剪切板
  let image = nativeImage.createFromDataURL(getImageUrl(imageData));
  clipboard.writeImage(image);

  ipcRenderer.send("console-log", { x, y, w, h });
  // 保存图片到本地
  saveImage(getImageUrl(imageData));
  // 完成后 关闭窗口
  closeWin();
};

document.getElementById("okBtn").addEventListener("click", getCaptureImage);
document.getElementById("closeBtn").addEventListener("click", closeWin);
window.onload = () => {
  console.log("ss");
  drawBgImage();
};
