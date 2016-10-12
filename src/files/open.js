import { readdir } from 'fs'
import { extname, basename, resolve, join } from 'path'

import { ipcMain, dialog } from 'electron'
import { promisify } from 'bluebird'

import { getIpcInstance as log } from '../logger'

const readdirAsync = promisify(readdir)

const DEFAULT_TITLE = 'Select file(s)'
const DEFAULT_FILTERS = { name: 'All Files', extensions: ['*'] }

export const Events = {
  RESPONSE: ':response',
  ACTION_OPEN_FILE: 'action:open:file',
  ACTION_OPEN_FOLDER: 'action:open:folder',
  RESPONSE_OPEN_FILE: 'action:open:file:response'
}

/**
 * Register all of the file events
 */
export default function registerFileOpenEvents() {
  log().debug('Registering events...')
  ipcMain.on(Events.ACTION_OPEN_FILE, onOpenFile)
  ipcMain.on(Events.ACTION_OPEN_FOLDER, onOpenFile)
}

export function onOpenFile(event, { folder = false, multi = false, title = DEFAULT_TITLE, path = '', filters = DEFAULT_FILTERS } = {}) {
  const properties = ['openFile']
  if (multi) {
    properties.push('multiSelections')
  }

  if (folder) {
    properties.push(...['openDirectory', 'multiSelections'])
  }

  const handler = folder ?
    result => findXMLsInFolder(event, result || []) :
    (result) => {
      log().debug(`Sending ${Events.RESPONSE_OPEN_FILE}`, result, 'File:Open')
      event.sender.send(Events.RESPONSE_OPEN_FILE, result || [])
    }

  const options = { properties, title, path, filters }
  dialog.showOpenDialog(options, handler)
}

async function findXMLsInFolder(event, folderNames = []) {
  const fileList = []
  for (const folder of folderNames) {
    const files = await readdirAsync(folder)
    const xmls = files
      .filter(x => extname(x) === '.xml')
      .filter(x => basename(x, 'xml').toLowerCase().indexOf('menuboard') === -1)
      .map(x => resolve(join(folder, x)))
    fileList.push([...xmls])
  }
  log().debug(`Sending ${Events.ACTION_OPEN_FOLDER}:response`, fileList, 'File:Open')
  event.sender.send(`${Events.ACTION_OPEN_FOLDER}:response`, fileList)
}
