import { resolve } from 'path'
import { app, BrowserWindow, Menu } from 'electron'
import windowState from 'electron-window-state'

import menuHelper from './menu'
import registerFileOpenEvents from './files/open'

const HTML_PATH = resolve(__dirname, '..', 'src/client/app.html')
const WIDTH = 1024
const HEIGHT = 728

let menu
let mainWindow = null

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')() // eslint-disable-line global-require
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

async function installExtensions() {
  if (process.env.NODE_ENV === 'development') {
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

  registerFileOpenEvents()
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => (mainWindow = null))

  if (process.env.NODE_ENV === 'development') {
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
