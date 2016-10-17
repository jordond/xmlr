import Base from './base'

/**
 * Console logging class
 *
 * Set as a replacement to console.log.
 *
 * @class Console
 * @extends {Base}
 */
export default class Console extends Base {

  /**
   * Creates a Console logger
   *
   * @param {String} tag - Tag of the calling class
   * @param {Object} [options] - Override logger options
   * @returns
   */
  constructor(tag, options = {}) {
    super(tag, options)
  }

  /**
   * Output the message to the console
   * Check if current message is allowed to log, then construct the message and output to log
   *
   * @param {Object}  item - Contains all information required to output to log
   * @param {String}  item.level - Log level of the message
   * @param {String}  item.message - Message to log
   * @param {any}     [item.data=''] - Other data to output
   * @param {Boolean} [force=false] - Ignore the log level check and always output
   * @returns {Console} Instance of itself, so that log messages can be chained
   */
  toConsole(item, force = false) {
    if (super.shouldLog(item.level) || force) {
      const header = this.formatHeader(item.level, this.tag)
      const newLine = (item.data !== null && typeof item.data === 'object') ? '\n' : ''
      item.data = item.data || ''

      const message = `${Base.timestamp()}${header} ${item.message}${newLine}`
      if (item.level === 'WARN') {
        console.warn(message, item.data)
      } else if (item.level === 'ERROR') {
        console.error(message, item.data)
      } else {
        console.log(message, item.data)
      }
    }
    return this
  }

  /**
   * Always output to log
   * No matter the current set log level, this will always output
   *
   * @param {String} message - Message to log
   * @param {Object} [data={}] - Other data to output
   * @param {Boolean} [force=true] - Whether or not to force output (Should always be true)
   * @returns
   */
  out(message, data = {}, force = true) {
    const item = { level: 'LOG', message, data }
    return this.toConsole(item, force)
  }

  /**
   * When something has gone wrong
   * Always pass 'true' to {this.toConsole}, so that it is always outputted
   * @param {string}  message Content to output
   * @param {any}     data    Extra info to pass to console
   */
  error(message, data) {
    return this.toConsole({ level: 'ERROR', message, data }, true)
  }

  /**
   * Something is not acceptable, but not desired
   * @param {string}  message Content to output
   * @param {any}     data    Extra info to pass to console
   */
  warning(message, data) {
    return this.toConsole({ level: 'WARN', message, data })
  }

  /**
   * Not necessary information, but still nice to see
   * @param {string}  message Content to output
   * @param {any}     data    Extra info to pass to console
   */
  info(message, data) {
    return this.toConsole({ level: 'INFO', message, data })
  }

  /**
   * Extra information
   * @param {string}  message Content to output
   * @param {any}     data    Extra info to pass to console
   */
  verbose(message, data) {
    return this.toConsole({ level: 'VERBOSE', message, data })
  }

  /**
   * Debug level information
   * @param {string}  message Content to output
   * @param {any}     data    Extra info to pass to console
   */
  debug(message, data) {
    return this.toConsole({ level: 'DEBUG', message, data })
  }

  /**
   * All silly things to be outputted
   * @param {string}  message Content to output
   * @param {any}     data    Extra info to pass to console
   */
  silly(message, data) {
    return this.toConsole({ level: 'SILLY', message, data })
  }
}
