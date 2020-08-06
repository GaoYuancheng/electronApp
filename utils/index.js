const debug = /--debug/.test(process.argv[2]);

// const types = [
//   "video/webm",
//   "audio/webm",
//   "video/webm;codecs=vp8",
//   "video/webm;codecs=daala",
//   "video/webm;codecs=h264",
//   "audio/webm;codecs=opus",
//   "video/mpeg",
//   "video/flv",
//   "video/mp4",
// ];

// // 检查浏览器是否支持对应的mimetype

// types.forEach((item) => {
//   console.log(item + "  " + MediaRecorder.isTypeSupported(item));
// });

module.exports = {
  debug,
};
