const { globalShortcut } = require("electron");

globalShortcut.register("CommandOrControl+A", function() {
  console.log("sss");
});

globalShortcut.register("Esc", () => {
  // if (captureWin) {
  //   captureWin.close();
  //   captureWin = null;
  // }
  console.log("sss");
});
