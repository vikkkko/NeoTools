"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const electron_1 = require("electron");
const ElectronStore = require("electron-store");
const path = require("path");
let mainWindow;
exports.store = new ElectronStore();
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
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
electron_1.app.on("ready", () => {
    createWindow();
    if (!exports.store.get("node")) {
        exports.store.set("node", "http://seed2.ngd.network:10332");
    }
    electron_1.app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
let newWindow;
electron_1.ipcMain.on('createNewWin', (_, name) => {
    newWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
        },
        parent: mainWindow,
    });
    // newWindow.webContents.openDevTools();
    newWindow.loadURL(path.join('file:', __dirname, `../html/${name}.html`));
    newWindow.on('closed', () => { newWindow = null; });
});
electron_1.ipcMain.on('store-get', (event, key) => {
    const v = exports.store.get(key);
    console.log(v);
    event.returnValue = v;
});
// sets a key on the store
electron_1.ipcMain.on('store-set', (event, key, value) => {
    exports.store.set(key, value);
});
electron_1.ipcMain.on('store-reset', (event) => {
    exports.store.clear();
});
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
//# sourceMappingURL=main.js.map