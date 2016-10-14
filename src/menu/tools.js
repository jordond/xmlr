import { STATE_SAVE, STATE_LOAD, STATE_KEY_XML } from '../events'

function other(mainWindow) {
  const saveState = {
    label: 'Save XML state',
    click() {
      mainWindow.webContents.send(STATE_SAVE, { state: STATE_KEY_XML })
    }
  }

  const loadState = {
    label: 'Load saved XML state',
    click() {
      mainWindow.webContents.send(STATE_LOAD, { state: STATE_KEY_XML })
    }
  }

  return {
    label: '&Tools',
    submenu: (process.env.NODE_ENV === 'development') ? [
      saveState,
      loadState
    ] : [{ label: 'Todo' }]
  }
}

export default other
