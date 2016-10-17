import { LOG_MESSAGE } from '../events'
import Console from './console'

/**
 * Logging class that outputs to console, and emits IPC events
 *
 *
 * @class IPCLogger
 * @extends {Console}
 */
export default class IPCLogger extends Console {
  /**
   * @static {Object} webContents - Instance of the Renderer process
   */
  webContents

  constructor(webContents, tag, options = {}) {
    super(tag, options)
    this.webContents = webContents
  }

  /**
   * Sends the log message to the Renderer process via the webcontents object
   * {@link https://github.com/electron/electron/blob/master/docs/api/web-contents.md}
   *
   * @param {String} level - Level of message to log
   * @param {String}  item.message - Message to log
   * @param {Object} [data={}] - Other data to output
   * @param {Boolean} [force=false] - Whether or not to force output
   * @returns
   */
  send(level, message, data, force = false) {
    if (this.shouldLog(level) || force) {
      this.webContents.send(LOG_MESSAGE, { tag: this.tag, level, message, data })
    }
  }

  /**
   * @see Console#out
   */
  out(message, data, tag = this.tag) {
    this.send('LOG', message, data, tag)
    return super.out(message, data, true)
  }

  /**
   * @see Console#error
   */
  error(message, data, tag = this.tag) {
    this.send('ERROR', message, data, tag)
    return super.error(message, data)
  }

  /**
   * @see Console#warning
   */
  warning(message, data, tag = this.tag) {
    this.send('WARN', message, data, tag)
    return super.warning(message, data)
  }

  /**
   * @see Console#info
   */
  info(message, data, tag = this.tag) {
    this.send('INFO', message, data, tag)
    return super.info(message, data)
  }

  /**
   * @see Console#verbose
   */
  verbose(message, data, tag = this.tag) {
    this.send('VERBOSE', message, data, tag)
    return super.verbose(message, data)
  }

  /**
   * @see Console#debug
   */
  debug(message, data, tag = this.tag) {
    this.send('DEBUG', message, data, tag)
    return super.debug(message, data)
  }

  /**
   * @see Console#silly
   */
  silly(message, data, tag = this.tag) {
    this.send('SILLY', message, data, tag)
    return super.silly(message, data)
  }
}
