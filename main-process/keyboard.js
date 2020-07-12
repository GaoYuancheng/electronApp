let { pressEsc } = require("./record");
const { globalShortcut } = require("electron");

globalShortcut.register("Esc", () => {
  pressEsc();
  console.log("sss");
});
globalShortcut.register("CommandOrControl+A", function () {
  console.log("sss");
});
