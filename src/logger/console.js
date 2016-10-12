import Base from './base'

export default class Console extends Base {
  constructor(tag, options = {}) {
    super(tag, options)
  }

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

  out(message, data = {}, force = true) {
    const item = { level: 'LOG', message, data }
    return this.toConsole(item, null, force)
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
