const { ipcRenderer, remote, nativeImage, clipboard } = require("electron");
let { width, height } = remote.screen.getPrimaryDisplay().bounds;

let canvas = document.getElementById("canvas");
let bgImg = document.getElementById("bgImg");
let sizeInfo = document.getElementById("sizeInfo");
let tools = document.getElementById("tools");

bgImg.width = width;
bgImg.height = height;
// let bgImgDiv = document.getElementById("bgImgDiv");

let screenWidth = document.body.offsetWidth;
let screenHeight = document.body.offsetHeight;
console.log(screenHeight, screenWidth);

// document.body.style.maxHeight = height;
// document.body.style.maxWidth = width;

let screenImgData = "";

// const ratio = window.devicePixelRatio || 2;
// 处理canvas 导出的图片模糊问题 TODO: 不是很懂
// const ratio = 1;

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

const getPixelRatio = (context) => {
  var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
};

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
  // x = y = 0;
};

// 画背景图
// const drawBgImage = imageData => {
//   const imageUrl = getImageUrl(imageData);
//   bgImg.src = imageUrl;
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
    // document.body.removeChild(canvas);

    video.height = screenHeight;
    video.width = screenWidth;
    // video.style.width = `${screenWidth}px`;
    // video.style.height = `${screenHeight}px`;
    // video.style.cssText = "position:absolute;top:-10000px;left:-10000px;";

    let loaded = false;
    video.onloadedmetadata = () => {
      if (loaded) return;
      loaded = true;
      video.play();
      stream.getTracks()[0];

      const _canvas = document.createElement("canvas");

      const _ctx = _canvas.getContext("2d");

      const ratio = getPixelRatio(_ctx);

      // _canvas.width = video.width * ratio;
      // _canvas.height = video.height * ratio;
      _canvas.width = video.width;
      _canvas.height = video.height;
      _canvas.style.width = `${video.width}px`;
      _canvas.style.height = `${video.height}px`;
      // console.log(video.width, video.height);

      // _ctx.drawImage(video, 0, 0, _canvas.width, _canvas.height);
      // _ctx.scale(ratio, ratio);
      _ctx.drawImage(video, 0, 0, screenWidth, screenHeight);

      ipcRenderer.send("console-log", {
        screenWidth,
        screenHeight,
        ratio,
        width,
      });

      bgImg.src = _canvas.toDataURL("image/png", 1);
      // bgImgDiv.style.backgroundImage = _canvas.toDataURL("image/png");
      // console.log(screenWidth, screenWidth);
      screenImgData = _ctx.getImageData(0, 0, screenWidth, screenHeight);

      // screenImgData = _ctx1.getImageData(0, 0, screenWidth, screenHeight);
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

canvas.addEventListener("mousedown", onMousedown);
canvas.addEventListener("mouseup", onMouseup);
canvas.addEventListener("mousemove", onMouseMove);
document.getElementById("okBtn").addEventListener("click", getCaptureImage);
document.getElementById("closeBtn").addEventListener("click", closeWin);
window.onload = () => {
  console.log("ss");
  drawBgImage();
};
