import { app, Menu } from 'electron'

const isDevelop = process.env.NODE_ENV === 'development'

export async function initDebug() {
  if (isDevelop) {
    require('electron-debug')() // eslint-disable-line global-require
    await installExtensions()
  }
}

async function installExtensions() {
  const installer = require('electron-devtools-installer') // eslint-disable-line global-require
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REACT_PERF']
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload)
    } catch (e) {} // eslint-disable-line
  }
}

export function buildDevMenu(mainWindow) {
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
}
