import { readdir } from 'fs'
import { extname, join } from 'path'

import { ipcMain, dialog } from 'electron'
import { promisify } from 'bluebird'

import * as Events from '../events'
import { getIpcInstance as log } from '../logger'

const readdirAsync = promisify(readdir)

const DEFAULT_TITLE = 'Select file(s)'
const DEFAULT_FILTERS = { name: 'All Files', extensions: ['*'] }

/**
 * Register all of the file events
 */
export default function registerFileOpenEvents() {
  log().debug('Registering file open events...')
  ipcMain.on(Events.ACTION_OPEN_FILE, onOpenFile)
  ipcMain.on(Events.ACTION_OPEN_FOLDER, onOpenFile)
}

/**
 * Open the file dialog and handle the response
 * If options.folder is true, then the directory select will open
 *
 * {@link https://github.com/electron/electron/blob/master/docs/api/dialog.md}
 *
 * @param {Object}    event - ipcRenderer event object
 * @param {Object}    [options] - Options for the dialog
 * @param {Boolean}   [options.folder=false] - Open a folder instead of a file
 * @param {Boolean}   [options.multi=false] - Allow the selection of multiple files
 * @param {String}    [options.title=DEFAULT_TITLE] - Title to display on the dialog
 * @param {String}    [path=''] - Initial path to open file dialog to
 * @param {Object[]}  [filters[]=DEFAULT_FILTERS] - File filters to allow
 * @param {String}    [filters[].name] - Name to display in filter label
 * @param {String[]}  [filters[].extensions] - Extensions to allow
 * @return {String[]} List of xml file paths
 */
export function onOpenFile(event, { folder = false, multi = false, title = DEFAULT_TITLE, path = '', filters = DEFAULT_FILTERS } = {}) {
  const properties = ['openFile']
  if (multi) {
    properties.push('multiSelections')
  }

  if (folder) {
    properties.push(...['openDirectory', 'multiSelections'])
  }

  // Decide which callback handler to use
  const handler = folder ?
    result => findXMLsInFolder(event, result || []) :
    (result) => {
      log().debug(`Sending ${Events.RESPONSE_OPEN_FILE}`, result, 'File:Open')
      return event.sender.send(Events.RESPONSE_OPEN_FILE, result || [])
    }

  dialog.showOpenDialog({ properties, title, path, filters }, handler)
}

/**
 * Takes a list of folder names and find's all of the xml files in each folder
 * NOTE: This does not recursively search the folders
 *
 * Example returned nested array
 * [['/path/to/file/file.txt'], ['a/b/c/file.txt', z/x/y/file.txt]]
 *
 * @param {Object} event
 * @param {String[]} [folders=[]] - List of folder paths
 * @return {String[]} Nested array of file paths to all of the found xml files
 */
async function findXMLsInFolder(event, folders = []) {
  const fileList = []

  // Iterate through the list of folders and list all files
  for (const folder of folders) {
    const files = await readdirAsync(folder)

    // Filter out all files that are not xmls
    const xmls = files
      .filter(x => extname(x) === '.xml')
      .map(x => join(folder, x))

    // Push array of xmls into the array => [ [file1, file2] ]
    fileList.push([...xmls])
  }

  log().debug(`Sending ${Events.RESPONSE_OPEN_FOLDER}`, fileList, 'File:Open')
  return event.sender.send(Events.RESPONSE_OPEN_FOLDER, fileList)
}
