import {app, BrowserWindow, Menu, shell} from 'electron';
import {join} from 'path';
import {URL} from 'url';
import isDev from 'electron-is-dev';

const isSingleInstance = app.requestSingleInstanceLock();
const electronConfig = {
  URL_LAUNCHER_FRAME: 1, //process.env.URL_LAUNCHER_FRAME === '1' ? 1 : 0,
  URL_LAUNCHER_KIOSK: process.env.URL_LAUNCHER_KIOSK === '1' ? 1 : 0,
  URL_LAUNCHER_WIDTH: parseInt(process.env.URL_LAUNCHER_WIDTH || 800, 10),
  URL_LAUNCHER_HEIGHT: parseInt(process.env.URL_LAUNCHER_HEIGHT || 480, 10),
  URL_LAUNCHER_TITLE: process.env.URL_LAUNCHER_TITLE || 'vue3-weather-bluesky-display',
  URL_LAUNCHER_CONSOLE: process.env.URL_LAUNCHER_CONSOLE === '1' ? 1 : 0,
};

if (isDev) {
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

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.commandLine.appendSwitch("disable-software-rasterizer");
app.disableHardwareAcceleration();

if (isDev) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({default: installExtension, VUEJS_DEVTOOLS}) => installExtension(VUEJS_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
        // forceDownload: true, // 👈
      },
    })
  )
  .catch(e => console.error('Failed install extension:', e));
}

let mainWindow = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
		icon: join(__dirname, '../../renderer/dist/icons', 'icon.png'),
    resizable: false,
    width: electronConfig.URL_LAUNCHER_WIDTH,
    height: electronConfig.URL_LAUNCHER_HEIGHT,
    frame: !!electronConfig.URL_LAUNCHER_FRAME,
    title: electronConfig.URL_LAUNCHER_TITLE,
    kiosk: !!electronConfig.URL_LAUNCHER_KIOSK,
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      nativeWindowOpen: true,
      preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
    icon: join(__dirname, '../../renderer/assets/box-gears-256.png') // Update this path to your icon file
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    if (isDev) {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl = isDev && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();


  await mainWindow.loadURL(pageUrl);
};

 app.on('web-contents-created', (_event, contents) => {

  /**
   * Block navigation to origins not on the allowlist.
   *
   * Navigation is a common attack vector. If an attacker can convince the app to navigate away
   * from its current page, they can possibly force the app to open web sites on the Internet.
   *
   * @see https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
   */
  contents.on('will-navigate', (event, url) => {
    const allowedOrigins =
      new Set(); // Do not use insecure protocols like HTTP. https://www.electronjs.org/docs/latest/tutorial/security#1-only-load-secure-content
    const { origin, hostname } = new URL(url);
    const isDevLocalhost = isDevelopment && hostname === 'localhost'; // permit live reload of index.html
    if (!allowedOrigins.has(origin) && !isDevLocalhost){
      console.warn('Blocked navigating to an unallowed origin:', origin);
      event.preventDefault();
    }
  });

  /**
  * Hyperlinks to allowed sites open in the default browser.
  *
  * The creation of new `webContents` is a common attack vector. Attackers attempt to convince the app to create new windows,
  * frames, or other renderer processes with more privileges than they had before; or with pages opened that they couldn't open before.
  * You should deny any unexpected window creation.
  *
  * @see https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
  * @see https://www.electronjs.org/docs/latest/tutorial/security#15-do-not-use-openexternal-with-untrusted-content
  */
  contents.setWindowOpenHandler(({ url }) => {
    const allowedOrigins =
      new Set([ // Do not use insecure protocols like HTTP. https://www.electronjs.org/docs/latest/tutorial/security#1-only-load-secure-content
      'https://vitejs.dev',
      'https://github.com',
      'https://v3.vuejs.org']);
    const { origin } = new URL(url);
    if (allowedOrigins.has(origin)){
      shell.openExternal(url);
    } else {
      console.warn('Blocked the opening of an unallowed origin:', origin);
    }
    return { action: 'deny' };
  });
});


app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.whenReady()
  .then(() => {
    Menu.setApplicationMenu(null);
    createWindow();
  })
  .catch((e) => console.error('Failed create window:', e));


// Auto-updates
// if (import.meta.env.PROD) {
//   app.whenReady()
//     .then(() => import('electron-updater'))
//     .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
//     .catch((e) => console.error('Failed check updates:', e));
// }
