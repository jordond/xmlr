import { LOG_MESSAGE } from './'
import Console from './console'

export default class IPCLogger extends Console {
  webContents

  constructor(webContents, tag, options = {}) {
    super(tag, options)
    this.webContents = webContents
  }

  send(level, message, data, force = false) {
    if (this.shouldLog(level) || force) {
      this.webContents.send(LOG_MESSAGE, { tag: this.tag, level, message, data })
    }
  }

  out(message, data = {}, tag = this.tag) {
    this.send('LOG', message, data, tag)
    return super.out(message, data, true)
  }

  error(message, data = {}, tag = this.tag) {
    this.send('ERROR', message, data, tag)
    return super.error(message, data)
  }

  warning(message, data = {}, tag = this.tag) {
    this.send('WARN', message, data, tag)
    return super.warning(message, data)
  }

  info(message, data = {}, tag = this.tag) {
    this.send('INFO', message, data, tag)
    return super.info(message, data)
  }

  verbose(message, data = {}, tag = this.tag) {
    this.send('VERBOSE', message, data, tag)
    return super.verbose(message, data)
  }

  debug(message, data = {}, tag = this.tag) {
    this.send('DEBUG', message, data, tag)
    return super.debug(message, data)
  }

  silly(message, data = {}, tag = this.tag) {
    this.send('SILLY', message, data, tag)
    return super.silly(message, data)
  }
}
