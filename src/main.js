import { resolve } from 'path'

import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import windowState from 'electron-window-state'

import { initIpc, LOG_REGISTER, LOG_OPTIONS } from './logger'
import menuHelper from './menu'
import registerFileOpenEvents from './files/open'

const HTML_PATH = resolve(__dirname, '..', 'src/client/app.html')
const WIDTH = 1024
const HEIGHT = 728
const isDevelop = process.env.NODE_ENV === 'development'

let menu
let mainWindow = null

if (isDevelop) {
  require('electron-debug')() // eslint-disable-line global-require
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

async function installExtensions() {
  if (isDevelop) {
    const installer = require('electron-devtools-installer') // eslint-disable-line global-require
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REACT_PERF']
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload)
      } catch (e) {} // eslint-disable-line
    }
  }
}

async function onReady() {
  await installExtensions()

  const mainWindowState = windowState({ defaultWidth: WIDTH, defaultHeight: HEIGHT })
  const { x, y, width, height } = mainWindowState

  mainWindow = new BrowserWindow({ show: false, x, y, width, height })
  mainWindow.loadURL(`file://${HTML_PATH}`)
  console.log(HTML_PATH)

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  const loggerOptions = {
    level: process.env.LOG_LEVEL || isDevelop ? 'DEBUG' : 'INFO',
    short: !isDevelop
  }
  ipcMain.on(LOG_REGISTER, (event) => {
    log.debug('Sending logger options to render process')
    event.sender.send(LOG_OPTIONS, loggerOptions)
  })

  const log = initIpc(mainWindow.webContents, 'Main', loggerOptions)
  log.debug('Initialized the logger', loggerOptions)

  registerFileOpenEvents()

  mainWindow.on('closed', () => (mainWindow = null))

  if (isDevelop) {
    mainWindow.openDevTools()
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x: menuX, y: menuY } = props

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(menuX, menuY)
        }
      }, {
        label: 'Relaunch App',
        click() {
          app.relaunch()
          app.exit(0)
        }
      }]).popup(mainWindow)
    })
  }

  const template = menuHelper.build(mainWindow)
  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Manage window state
  mainWindowState.manage(mainWindow)
}

app.on('ready', onReady)
