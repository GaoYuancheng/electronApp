let { closeCaptureWin } = require("./screen");
const { globalShortcut } = require("electron");

globalShortcut.register("Esc", () => {
  closeCaptureWin();
  console.log("press Esc");
});
globalShortcut.register("CommandOrControl+A", function() {
  console.log("sss");
});
