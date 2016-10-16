/**
 * @classdesc A central entry point to create any of the available loggers
 *
 * TODO Extend Base or Console and create a log to file
 *
 * @author Jordon jordon.dehoog@cineplex.com
 */
import Console from './console'
import IPCLogger from './IPCLogger'

/**
 * @member {IPCLogger} ipcLogger - Global reference the ipc logger
 * @see #getIpcInstance | For usage
 */
let ipcLogger

/**
 * Initialize an IPCLogger singleton with a reference to the renderer process
 *
 * @param {Object} webContents - Reference to the Render window process
 * @param {string} [tag='Main'] - Tag to use for the console output
 * @param {Object} [config={}] - Optional logger config {@link Base#constructor}
 * @returns An instance of IPCLogger
 * @throws {Error} If there is no renderer process passed in
 */
export function initIpc(webContents, tag = 'Main', config = {}) {
  if (!webContents || typeof webContents !== 'object') {
    throw new Error('Logger:getIpcInstance -> No webcontents was passed, was not initialized')
  }
  ipcLogger = new IPCLogger(webContents, tag, config)
  return ipcLogger
}

/**
 * Get an instance of the IPC logger
 *
 * @returns An instance of IPCLogger
 */
export function getIpcInstance() {
  if (!ipcLogger) {
    throw new Error('Logger:getIpcInstance -> ipcLogger was not initialized')
  }
  return ipcLogger
}

/**
 * Creates a new console based logger
 *
 * @param {String} tag - Tag to use for the console output
 * @param {Object} [config={}] - Optional logger config {@link Base#constructor}
 * @returns An instance of the console logger
 */
export function createLogger(tag, config = {}) {
  return new Console(tag, config)
}

/**
 * Create a seperate instance of the ipc logger
 *
 * @param {Object} webContents - Reference to the Render window process
 * @param {String} tag - Tag to use for the console output
 * @param {Object} [config={}] - Optional logger config {@link Base#constructor}
 * @returns An instance of IPCLogger
 */
export function createIpcLogger(webContents, tag, config = {}) {
  return new IPCLogger(webContents, tag, config)
}
