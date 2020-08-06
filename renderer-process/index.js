const { ipcRenderer } = require("electron");

document.getElementById("capture-start").addEventListener("click", () => {
  ipcRenderer.send("capture-start");
});
document.getElementById("record-start").addEventListener("click", () => {
  ipcRenderer.send("record-start");
});
document.getElementById("test").addEventListener("click", () => {
  ipcRenderer.send("console-log", ["ss", "dd"]);
});
