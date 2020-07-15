const fs = require("fs");

const saveImage = (e, imgUrl) => {
  console.log("savaImagfe");
  let base64Data = imgUrl.replace(/^data:image\/\w+;base64,/, "");
  let dataBuffer = Buffer.from(base64Data, "base64");
  fs.writeFile("out.png", dataBuffer, () => {});
};

module.exports = {
  saveImage
};
