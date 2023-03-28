const { app, BrowserWindow } = require('electron')
const remoteMain = require("@electron/remote/main")
const path = require('path')

remoteMain.initialize()

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    //autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(app.getAppPath(), './src/preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.loadFile('./src/pages/index.html')
  win.maximize()

  remoteMain.enable(win.webContents)
  app.on('browser-window-created', (_, win) => {
    remoteMain.enable(win.webContents)
  })
  

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
