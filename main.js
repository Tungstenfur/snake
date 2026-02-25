const { app, BrowserWindow } = require("electron");
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    autoHideMenuBar: true,
    fullscreen: true,
    webPreferences: {
      contextIsolation: true,
      autoplayPolicy: "no-user-gesture-required",
    },
  });
  win.loadFile("index.html");
}
app.whenReady().then(createWindow);
