import { basename, dirname, join } from 'path'
import { stat } from 'fs'

import { copy } from 'fs-extra'
import { promisify } from 'bluebird'
import { ipcMain } from 'electron'

import { getIpcInstance as log } from '../logger'
import { ACTION_SWITCH_XML, generateResponse } from '../events'

/**
 * Convert from callback structure to promises to use async/await syntax
 */
const statAsync = promisify(stat)
const copyAsync = promisify(copy)

/**
 * @constant {String} DEFAULT_BACKUP_NAME - Default string to add on to xml file when switching it
 */
const DEFAULT_BACKUP_NAME = '_backup'

/**
 * Register the ipc events
 */
export default function registerEvents() {
  log().debug('Registering Switcher events...')

  ipcMain.on(ACTION_SWITCH_XML, onSwitchXML)
}

/**
 * Check to see if a file or directory exists
 * await stat() will throw an error if file doesn't exist.  In some cases we need a boolean not an exception
 *
 * @param {String} path - Path to the file or directory
 * @returns {Boolean} - True if exists, false if not
 */
async function fileExists(path) {
  try {
    return await statAsync(path)
  } catch (error) {
    return false
  }
}

/**
 * Swap the current "menuboard.xml" with the selected xml
 *
 * Create a backup before any copying is done, so that it can be easily reversed on exit or finish
 *
 * @param {any} event - Electron.webContents
 * @param {any} { targetPath: String, selectedPath:String } - Path to target xml, and the swapping xml
 * @return {Object} result - Result of the switch
 * @return {Boolean} result.success - Whether the operation was successful
 * @return {String} result.message - Reason for failure, if one
 */
async function onSwitchXML(event, { targetPath, selectedPath }) {
  log().info('Attempting to switch xml...')
       .verbose('Paths', { targetPath, selectedPath })

  const respond = payload => event.sender.send(generateResponse(ACTION_SWITCH_XML), payload)

  try {
    // Check to make sure the two files exist
    await statAsync(targetPath)
    await statAsync(selectedPath)

    // Create backup
    const backupFilename = targetPath.replace('.xml', `${DEFAULT_BACKUP_NAME}.xml`)
    const backupExists = await fileExists(backupFilename)
    if (!backupExists) {
      log().verbose(`Creating backup of [${targetPath}] with [${basename(backupFilename)}]`)
      await copyAsync(targetPath, backupFilename, { clobber: true })
    }

    // Overwrite the target xml with the selected xml
    const currentFilename = basename(targetPath)
    const currentPath = dirname(targetPath)
    await copyAsync(selectedPath, join(currentPath, currentFilename), { clobber: true })

    log().info(`Successfully switched [${currentFilename}] with [${basename(selectedPath)}]`)
    return respond({ success: true })
  } catch (error) {
    const { message, code, path = '' } = error
    log().error(`Failed to switch xml -> ${message}`, error)
    return respond({ success: false, message, code, path })
  }
}
