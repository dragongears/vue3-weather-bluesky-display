const { app, BrowserWindow, Menu } = require("electron");
const { default: installExtension, VUEJS3_DEVTOOLS } = require('electron-devtools-installer');
const path = require("path");
const isDevelopment = process.env.NODE_ENV !== 'production';

const electronConfig = {
  URL_LAUNCHER_FRAME: 1, //process.env.URL_LAUNCHER_FRAME === '1' ? 1 : 0,
  URL_LAUNCHER_KIOSK: process.env.URL_LAUNCHER_KIOSK === '1' ? 1 : 0,
  URL_LAUNCHER_WIDTH: parseInt(process.env.URL_LAUNCHER_WIDTH || 800, 10),
  URL_LAUNCHER_HEIGHT: parseInt(process.env.URL_LAUNCHER_HEIGHT || 480, 10),
  URL_LAUNCHER_TITLE: process.env.URL_LAUNCHER_TITLE || 'vue3-weather-instagram-display',
  URL_LAUNCHER_CONSOLE: process.env.URL_LAUNCHER_CONSOLE === '1' ? 1 : 0,
  ELECTRON_DISABLE_HW_ACCELERATION:
    process.env.ELECTRON_DISABLE_HW_ACCELERATION === '1',
};

// Enable / disable hardware acceleration
if (electronConfig.ELECTRON_DISABLE_HW_ACCELERATION) {
  app.disableHardwareAcceleration();
}

if (isDevelopment) {
  // Don't load any native (external) modules until the following line is run:
  require('module').globalPaths.push(process.env.NODE_MODULES_PATH);

  /*eslint no-console:0*/
  console.log('Running in development mode');
  Object.assign(electronConfig, {
    URL_LAUNCHER_HEIGHT: 800,
    URL_LAUNCHER_WIDTH: 1400,
    URL_LAUNCHER_KIOSK: 0,
    URL_LAUNCHER_CONSOLE: 1,
    URL_LAUNCHER_FRAME: 1
  });
}

function createWindow() {
  const win = new BrowserWindow({
    resizable: false,
    width: electronConfig.URL_LAUNCHER_WIDTH,
    height: electronConfig.URL_LAUNCHER_HEIGHT,
    frame: !!electronConfig.URL_LAUNCHER_FRAME,
    title: electronConfig.URL_LAUNCHER_TITLE,
    kiosk: !!electronConfig.URL_LAUNCHER_KIOSK,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDevelopment) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.whenReady().then(() => {
  if (isDevelopment) {
    installExtension(VUEJS3_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }

  Menu.setApplicationMenu(null);

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
