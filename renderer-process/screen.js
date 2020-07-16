const { ipcRenderer, remote } = require("electron");

let canvas = document.getElementById("canvas");
let bgImg = document.getElementById("bgImg");

let screenWidth = document.body.offsetWidth;
let screenHeight = document.body.offsetHeight;

// bgImg.style.width = screenWidth;
// bgImg.style.height = screenHeight;

let screenImgUrl = "";
let screenImgData = "";

// const ratio = window.devicePixelRatio || 2;
// 处理canvas 导出的图片模糊问题 TODO: 不是很懂
const ratio = 1;

canvas.width = screenWidth;
canvas.height = screenHeight;
let ctx = canvas.getContext("2d");
let mouseHasDownInCanvas = false;
let x,
  y,
  w,
  h = 0;

// 开始移动
let moveStart = false;
const onMousedown = e => {
  const { offsetX, offsetY } = e;
  mouseHasDownInCanvas = true;
  moveStart = true;
  // console.log(offsetX, offsetY);
  x = offsetX;
  y = offsetY;
};

const onMouseMove = e => {
  if (moveStart) {
    clear(canvas);
    const { offsetX, offsetY } = e;
    w = offsetX - x;
    h = offsetY - y;
    drawRect(x, y, w, h);
  }
};

const onMouseup = () => {
  if (mouseHasDownInCanvas && moveStart) {
    mouseHasDownInCanvas = false;
    moveStart = false;
  }
};

// 清除画布
const clear = canvas => {
  canvas.height += 1;
  canvas.height -= 1;
};

const drawRect = (x, y, w, h) => {
  // console.log(x, y, w, h);
  ctx.rect(x, y, w, h);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
  // x = y = 0;
};

// 画背景图
// const drawBgImage = imageData => {
//   const imageUrl = getImageUrl(imageData);
//   bgImg.src = imageUrl;
// };

// get 图片的url
const getImageUrl = imageData => {
  let _canvas = document.createElement("canvas");
  _canvas.width = w;
  _canvas.height = h;
  let _ctx = _canvas.getContext("2d");
  _ctx.putImageData(imageData, 0, 0);
  return _canvas.toDataURL();
};

const saveImage = imgUrl => {
  console.log("save", imgUrl);
  ipcRenderer.send("save-image", imgUrl);
};

const { desktopCapturer } = require("electron");
const drawBgImage = () => {
  let { width, height } = remote.screen.getPrimaryDisplay().bounds;
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async sources => {
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
                  maxHeight: height
                }
              }
            });
            handleStream(stream);
          } catch (e) {
            console.log(e);
          }
          return;
        }
      }
    });

  const handleStream = stream => {
    if (!stream) return;

    const video = document.createElement("video");
    // document.body.removeChild(canvas);

    video.height = screenHeight;
    video.width = screenWidth;
    video.onloadedmetadata = () => {
      stream.getTracks()[0];
      video.play();
      const _canvas = document.createElement("canvas");
      _canvas.width = video.width * ratio;
      _canvas.height = video.height * ratio;

      const _ctx = _canvas.getContext("2d");
      _ctx.drawImage(video, 0, 0);

      // const _canvas1 = document.createElement("canvas");
      // _canvas1.width = video.width;
      // _canvas1.height = video.height;

      // const _ctx1 = _canvas.getContext("2d");
      // _ctx1.drawImage(video, 0, 0);

      bgImg.src = _canvas.toDataURL();
      screenImgData = _ctx.getImageData(0, 0, screenWidth, screenHeight);
      console.log(screenWidth, screenWidth);
      // screenImgData = _ctx1.getImageData(0, 0, screenWidth, screenHeight);
    };

    video.srcObject = stream;
  };
};

const getCaptureImage = () => {
  const _canvas = document.createElement("canvas");
  const _ctx = _canvas.getContext("2d");
  _canvas.width = screenWidth;
  _canvas.height = screenHeight;
  _ctx.putImageData(screenImgData, 0, 0);

  // document.body.appendChild(_canvas);

  const imageData = _ctx.getImageData(x, y, w, h);

  saveImage(getImageUrl(imageData));
  // 完成后 关闭窗口
  ipcRenderer.send("close-capture-win");
};

canvas.addEventListener("mousedown", onMousedown);
canvas.addEventListener("mouseup", onMouseup);
canvas.addEventListener("mousemove", onMouseMove);
document
  .getElementById("getCaptureImage")
  .addEventListener("click", getCaptureImage);
// document
//   .getElementById("getDesktopCapturer")
//   .addEventListener("click", getDesktopCapturer);
window.onload = () => {
  console.log("ss");
  drawBgImage();
};
