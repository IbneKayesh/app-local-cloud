const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let serverProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:8080");
}

app.whenReady().then(() => {
  // Start backend server
  serverProcess = exec("node backend-app/server.js");

  serverProcess.stdout.on("data", (data) => console.log(data.toString()));
  serverProcess.stderr.on("data", (data) => console.error(data.toString()));

  createWindow();
});

app.on("window-all-closed", () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== "darwin") app.quit();
});
