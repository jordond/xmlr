import { resolve } from 'path'

import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import windowState from 'electron-window-state'

import { initDebug, buildDevMenu } from './dev-utils'
import { LOG_REGISTER, LOG_OPTIONS } from './events'
import settings, { init as initSettings, KEY_LOGGER } from './settings'
import { initIpc } from './logger'
import menuHelper from './menu'
import registerFileOpenEvents from './files/open'
import registerXmlSwitcherEvents from './files/switcher'

const HTML_PATH = resolve(__dirname, '..', 'src/client/app.html')
const WIDTH = 1024
const HEIGHT = 728

let menu
let mainWindow = null

if (process.platform !== 'darwin') {
  app.on('window-all-closed', () => app.quit())
}

async function onReady() {
  await initDebug()
  await initSettings()

  const mainWindowState = windowState({ defaultWidth: WIDTH, defaultHeight: HEIGHT })
  const { x, y, width, height } = mainWindowState

  mainWindow = new BrowserWindow({ show: false, x, y, width, height })
  mainWindow.loadURL(`file://${HTML_PATH}`)

  mainWindow.on('closed', () => (mainWindow = null))
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  const loggerOptions = await settings.get(KEY_LOGGER)
  const log = initIpc(mainWindow.webContents, 'Main', loggerOptions)
  log.debug('Initialized the logger', loggerOptions)

  ipcMain.on(LOG_REGISTER, (event) => {
    log.debug('Sending logger options to render process')
    event.sender.send(LOG_OPTIONS, loggerOptions)
  })

  // Register all events
  // TODO add helper to do this, rename all functions to register()
  registerFileOpenEvents()
  registerXmlSwitcherEvents()

  // Build menu
  const template = menuHelper.build(mainWindow)
  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Dev mode menu
  buildDevMenu(mainWindow)

  // Manage window state
  mainWindowState.manage(mainWindow)
}

app.on('ready', onReady)
