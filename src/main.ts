import { app, BrowserWindow,ipcMain } from "electron";
import * as ElectronStore from 'electron-store';
import * as path from "path";
let mainWindow: BrowserWindow;

export const store = new ElectronStore();

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../html/index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  if(!store.get("node")){
    store.set("node","http://seed2.ngd.network:10332");
  }
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
let newWindow: BrowserWindow;
ipcMain.on('createNewWin',(_,name)=>{
    newWindow = new BrowserWindow({
        width: 1200, 
        height: 1200,
        webPreferences: {
          nodeIntegration: true,
        },
        parent: mainWindow, //win是主窗口
    });
    // newWindow.webContents.openDevTools();
    newWindow.loadURL(path.join('file:',__dirname,`../html/${name}.html`));
    newWindow.on('closed',()=>{newWindow = null})
});

ipcMain.on('store-get', (event,key) => {
  const v  = store.get(key);
  console.log(v);
  event.returnValue = v;
});

// sets a key on the store
ipcMain.on('store-set', (event, key,value) => {
  store.set(key,value);
});

ipcMain.on('store-reset', (event) => {
  store.clear();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
