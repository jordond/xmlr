import { sendMessage } from '../utils/ipc-wrapper'
import * as Events from '../../events'

/**
 * @constant
 * {Object}   defaultOptions - Default options to use for sending messages
 * {Object[]} defaultOptions.filters - List of filters to use for file selection
 * {String}   defaultOptions.filters[].name - Label to display for extensions
 * {String[]} defaultOptions.filters[].extensions - Extensions to allow
 */
const defaultOptions = {
  filters: [{ name: 'Menuboard file', extensions: ['xml'] }]
}

/**
 * Select a target xml
 * TODO
 * @deprecated Soon to be replaced with selecting a target folder instead
 *
 * @returns {Promise<String[]|Error>} Selected files
 */
export function selectTargetXml() {
  const options = { ...defaultOptions, title: 'Select the target XML file' }
  return sendMessage(Events.ACTION_OPEN_FILE, options)
}

/**
 * Allows the selection of multiple xml files
 *
 * @returns {Promise<String[]|Error>} Selected files
 */
export function selectMultipleXMLs() {
  const options = { ...defaultOptions, title: 'Select the xmls to swap with the target', multi: true }
  return sendMessage(Events.ACTION_OPEN_FILE, options)
}

/**
 * Load xmls from selected folders
 *
 * @returns {Promise<Array[String[]]|Error>} Array of folders, each with an array of found xml files
 */
export function selectXMLFolder() {
  const options = { ...defaultOptions, title: 'Select a folder of XMLs', folder: true }
  return sendMessage(Events.ACTION_OPEN_FOLDER, options)
}

/**
 * Switch the target xml with the selected xml
 *
 * If successful it returns: { success: true }
 * If not { success: false, message: 'Error Message', code: 'Error code', path: 'error path' }
 *
 * @param {String} targetPath - Path to the target file
 * @param {String} selectedPath - Path to the selected file
 * @returns {Promise<Object>} - Result of the promise
 */
export function switchXML(targetPath, selectedPath) {
  // TODO eventually add functionality to play the swf?
  return sendMessage(Events.ACTION_SWITCH_XML, { targetPath, selectedPath })
}
