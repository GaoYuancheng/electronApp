const { ipcRenderer, remote } = require("electron");

let canvas = document.getElementById("canvas");
canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetHeight;
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
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();
  // x = y = 0;
};

const saveImage = imageData => {
  let _canvas = document.createElement("canvas");
  _canvas.width = w;
  _canvas.height = h;
  let _ctx = _canvas.getContext("2d");
  _ctx.putImageData(imageData, 0, 0);
  const imgUrl = _canvas.toDataURL();
  console.log("save");
  ipcRenderer.send("save-image", imgUrl);
};

const { desktopCapturer } = require("electron");
const getCaptureImage = () => {
  console.log("getCaptureImage");
  let { width, height } = remote.screen.getPrimaryDisplay().bounds;
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async sources => {
      for (const source of sources) {
        console.log(source);
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
            handleError(e);
          }
          return;
        }
      }
    });

  function handleStream(stream) {
    if (!stream) return;

    const video = document.createElement("video");
    // const video = document.getElementById("video");

    video.height = document.body.offsetHeight;
    video.width = document.body.offsetWidth;
    // document.body.appendChild(video);
    video.onloadedmetadata = () => {
      stream.getTracks()[0];
      video.play();
      const _canvas = document.createElement("canvas");
      _canvas.width = video.width;
      _canvas.height = video.height;
      const _ctx = _canvas.getContext("2d");
      // clear(_canvas);
      _ctx.drawImage(video, 0, 0);

      const imageData = _ctx.getImageData(x, y, w, h);
      // document.body.appendChild(_canvas);
      saveImage(imageData);
    };

    // video.onloadedmetadata = e => video.play();
    video.srcObject = stream;
    // ipcRenderer.send("close");
  }

  function handleError(e) {
    console.log(e);
  }
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
