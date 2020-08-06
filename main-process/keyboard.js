const { closeCaptureWin } = require("./screen");
const { closeRecordWin } = require("./record");
const { globalShortcut } = require("electron");

globalShortcut.register("Esc", () => {
  closeCaptureWin();
  closeRecordWin();
  console.log("press Esc");
});
// globalShortcut.register("CommandOrControl+A", function() {
//   console.log("sss");
// });
