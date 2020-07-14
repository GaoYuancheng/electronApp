const { ipcRenderer } = require("electron");

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
    clear();
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
var clear = () => {
  // console.log("ss", canvas.width, canvas.height);
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.height += 1;
  canvas.height -= 1;
  // ctx.fillStyle = "#fff";
  // ctx.beginPath();
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.closePath();
};

const drawRect = (x, y, w, h) => {
  // console.log(x, y, w, h);
  ctx.rect(x, y, w, h);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();
  x = y = 0;
};

const getImageData = () => {
  let imageData = ctx.getImageData(x, y, w, h);
  let _canvas = document.createElement("canvas");
  _canvas.width = w;
  _canvas.height = h;
  let _ctx = _canvas.getContext("2d");
  _ctx.putImageData(imageData, 0, 0);
  const imgUrl = _canvas.toDataURL();
  console.log(imgUrl);
  ipcRenderer.send("save-image", imgUrl);
};

canvas.addEventListener("mousedown", onMousedown);
canvas.addEventListener("mouseup", onMouseup);
canvas.addEventListener("mousemove", onMouseMove);
document.getElementById("getImageData").addEventListener("click", getImageData);
