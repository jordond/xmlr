import Console from './console'
import IPCLogger from './IPCLogger'

export const CHANNEL_PREFIX = 'log'
export const LOG_REGISTER = `${CHANNEL_PREFIX}:register`
export const LOG_MESSAGE = `${CHANNEL_PREFIX}:message`
export const LOG_OPTIONS = `${LOG_REGISTER}:response`

let ipcLogger

export function initIpc(webContents, tag = 'Main', config = {}) {
  if (!webContents || typeof webContents !== 'object') {
    throw new Error('Logger:getIpcInstance -> No webcontents was passed, was not initialized')
  }
  ipcLogger = new IPCLogger(webContents, tag, config)
  return ipcLogger
}

export function getIpcInstance() {
  if (!ipcLogger) {
    throw new Error('Logger:getIpcInstance -> ipcLogger was not initialized')
  }
  return ipcLogger
}

export function createLogger(tag, config = {}) {
  return new Console(tag, config)
}

export function createIpcLogger(webContents, tag, config = {}) {
  return new IPCLogger(webContents, tag, config)
}
