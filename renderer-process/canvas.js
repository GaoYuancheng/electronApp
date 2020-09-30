const initCanvas = (canvas, sizeInfo, tools, setxywh) => {
  // let canvas = document.getElementById("canvas");
  // let sizeInfo = document.getElementById("sizeInfo");
  // let tools = document.getElementById("tools");
  let screenWidth = document.body.offsetWidth;
  let screenHeight = document.body.offsetHeight;
  console.log(screenHeight, screenWidth);
  canvas.width = screenWidth;
  canvas.height = screenHeight;
  let ctx = canvas.getContext("2d");

  // 矩形尺寸
  let x = 0,
    y = 0,
    w = 0,
    h = 0;

  // mouseDown的点
  let mouseDownX = 0,
    mouseDownY = 0;
  // 鼠标移动的终点
  let moveEndX = 0,
    moveEndY = 0;
  // 是否在 已绘制的矩形上点击
  let mouseHasDownInRect = false;
  // 开始花矩形
  let drawStart = false;
  // 鼠标是否在点击后移动过
  let mouseHasMoved = false;
  // const ratio = window.devicePixelRatio || 2;
  // 处理canvas 导出的图片模糊问题 TODO: 不是很懂
  // const ratio = 1;

  // 渲染下方 tools 工具栏
  const renderTools = (x, y, w, h) => {
    tools.style.display = "block";
    tools.style.top = `${y + h + 15}px`;
    tools.style.left = `${x}px`;
    tools.style.width = `${w + 20}px`;
  };

  // 隐藏下方工具栏
  const hideTools = () => {
    tools.style.display = "none";
  };

  // 渲染左上角 size 信息
  const renderSize = (x, y, w, h) => {
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
    hideTools();
    const { offsetX, offsetY } = e;
    // 判断是否在已绘制的矩形中
    if (offsetX > x && offsetY > y && offsetX < x + w && offsetY < y + h) {
      mouseHasDownInRect = true;
      mouseDownX = offsetX;
      mouseDownY = offsetY;
    } else {
      x = offsetX;
      y = offsetY;
    }
    drawStart = true;
    console.log();
    // console.log(offsetX, offsetY);
  };

  const onMouseMove = (e) => {
    if (drawStart) {
      mouseHasMoved = true;
      clear(canvas);
      const { offsetX, offsetY } = e;

      if (mouseHasDownInRect) {
        // 拖拽选框 里面不可以直接改变x，y 的值
        moveEndX = x + offsetX - mouseDownX;
        moveEndY = y + offsetY - mouseDownY;
        drawRect(moveEndX, moveEndY, w, h);
        renderSize(moveEndX, moveEndY, w, h);
      } else {
        w = offsetX - x;
        h = offsetY - y;
        drawRect(x, y, w, h);
        renderSize(x, y, w, h);
      }
      console.log(x, y, w, h, mouseDownX, offsetX);
    } else {
      mouseHasMoved = false;
    }
  };

  const onMouseup = () => {
    // 如果是在矩形中 刚刚拖拽完
    if (mouseHasDownInRect) {
      x = moveEndX;
      y = moveEndY;
    }

    if (drawStart && mouseHasMoved) {
      renderTools(x, y, w, h);
    }
    setxywh(x, y, w, h);
    mouseHasMoved = false;
    drawStart = false;
    mouseHasDownInRect = false;
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

  canvas.addEventListener("mousedown", onMousedown);
  canvas.addEventListener("mouseup", onMouseup);
  canvas.addEventListener("mousemove", onMouseMove);
  // return {
  //   x,
  //   y,
  //   w,
  //   h,
  // };
};

module.exports = {
  initCanvas,
};
