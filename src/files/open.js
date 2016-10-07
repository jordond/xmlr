import { ipcMain, dialog } from 'electron'

const DEFAULT_TITLE = 'Select file(s)'
const DEFAULT_FILTERS = { name: 'All Files', extensions: ['*'] }

export const Events = {
  ACTION_OPEN_FILE: 'action:open:file',
  RESPONSE_OPEN_FILE: 'action:open:file:response',
}

/**
 * Register all of the file events
 */
export default function registerFileOpenEvents() {
  console.log('Registering events...')
  ipcMain.on(Events.ACTION_OPEN_FILE, onOpenFile)
}

export function onOpenFile(event, { multi = false, title = DEFAULT_TITLE, path = '', filters = DEFAULT_FILTERS }) {
  const properties = ['openFile']
  if (multi) {
    properties.push('multiSelections')
  }
  const options = { properties, title, path, filters }
  dialog.showOpenDialog(options, result => event.sender.send(Events.RESPONSE_OPEN_FILE, result))
}
