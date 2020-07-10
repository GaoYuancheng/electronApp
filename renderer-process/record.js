const { ipcRenderer } = require("electron");

document.getElementById("record-start").addEventListener("click", (e, arg) => {
  console.log("ss", arg);
  ipcRenderer.send("start", "ping");
});
