import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent, protocol, net } from 'electron';
import { stat, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { AppFile, HeicFileResponse } from './types/filesystem';
import Store from './configuration/store';
import WorkerPool from './workers/worker-pool';
import os from 'node:os';
import { TaskAction } from './workers/types';
import Manager from './db/manager';
import { ConfigurationNames, Constants } from './configuration/constants';
import FilesystemServer from './services/filesystem-server';
import WindowsFilesystemServer from './services/windows-filesystem-server';
import ImageCache from './services/image-cache';


// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let pool: WorkerPool;
let database: Manager;
let imageCache: ImageCache;
let filesystemServer: FilesystemServer;

function formatWindowsAppURL(url: string): string {
  if (url.length === 1) {
    return url + ":/";
  }

  return url.charAt(0) + ":" + url.substring(1);
}

function formatIxAppURL(url: string) {
  return url;
}

async function filesystemList(event: IpcMainInvokeEvent, path: string) {
  return await filesystemServer.listDirectory(path);
}

async function filesystemFileStat(event: IpcMainInvokeEvent, path: string): Promise<AppFile> {
  const result = await stat(path);

  return {
    path,
    name: basename(path),
    isFile: result.isFile(),
    size: result.size
  };
}

async function filesystemGetTextFileContext(event: IpcMainInvokeEvent, path: string): Promise<string> {
  return readFile(path, { encoding: "utf-8" });
}

function filesystemGetImageIconPath(event: IpcMainInvokeEvent, path: string, width: number, height: number): Promise<string> {
  return imageCache.getOrCreate(path, width, height);
}

async function filesystemGetHeicFile(event: IpcMainInvokeEvent, path: string): Promise<HeicFileResponse> {
  const result = await pool.runTaskPromise({
    type: TaskAction.LoadHeicData,
    path,
  });

  return result as HeicFileResponse;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Allow showing filesystem images and videos in app.
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { bypassCSP: true, stream: true } }
]);

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.APP_MODE === "dev") {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const userDataPath = app.getPath('userData');

  const constantsArgs = {
    appMode: process.env.APP_MODE || "prod",
    resourcesPath: process.resourcesPath,
    dirname: __dirname
  };

  Constants.init(constantsArgs);
  pool = new WorkerPool(os.availableParallelism(), constantsArgs);

  const store = new Store(join(userDataPath, ConfigurationNames.AppSettings));

  database = new Manager(join(userDataPath, ConfigurationNames.FileDatabase));
  await database.migrate()

  if (process.platform === "win32") {
    filesystemServer = new WindowsFilesystemServer();
  } else {
    filesystemServer = new FilesystemServer();
  }

  imageCache = new ImageCache(
    join(userDataPath, ConfigurationNames.ImageCache),
    database.imageCache,
    pool
  );
  await imageCache.initialize();

  ipcMain.handle('filesystem-list', filesystemList);
  ipcMain.handle('filesystem-get-text-file', filesystemGetTextFileContext);
  ipcMain.handle('filesystem-file-stat', filesystemFileStat);
  ipcMain.handle('filesystem-get-home-directory', () => app.getPath('home'));
  ipcMain.handle('filesystem-get-image-icon-path', filesystemGetImageIconPath)
  ipcMain.handle('config-get', store.getOptions.bind(store));
  ipcMain.handle('config-update', store.update.bind(store));

  ipcMain.handle('filesystem-get-heic-file', filesystemGetHeicFile);

  const formatAppURL = process.platform === "win32" ? formatWindowsAppURL : formatIxAppURL;

  protocol.handle('app', (request) => {
    const url = request.url.slice('app://'.length);

    return net.fetch("file://" + formatAppURL(url));
  });

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
