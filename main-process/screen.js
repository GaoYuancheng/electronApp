const fs = require("fs");

const saveImage = (e, imgUrl) => {
  var base64Data = imgUrl.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = Buffer.from(base64Data, "base64");
  fs.writeFile("out.png", dataBuffer, () => {});
};

module.exports = {
  saveImage
};
