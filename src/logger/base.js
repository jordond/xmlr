import moment from 'moment'

/**
 * @const {String[]} LOG_LEVELS - Available levels for logging
 */
const LOG_LEVELS = ['ERROR', 'WARN', 'INFO', 'VERBOSE', 'DEBUG', 'SILLY']

/**
 * @const {Number} LONGEST_LENGTH - Length of the longest level, used for keeping consistant output
 */
const LONGEST_LENGTH = 7

/**
 * Base logging class, contains functionlity for checking if logging should happen, and formatting of the output
 * TODO, if no options are passed in grab them from electron settings
 *
 * @class Base - Base logging class
 */
export default class Base {
  /**
   * Creates a logger
   *
   * @param {String}  tag - The tag to use when logging
   * @param {Object}  [options] - Override the logger options
   * @param {String}  [options.default] - If options.level does not exist in Base#LOG_LEVELS than use this output level
   * @param {String}  [options.level] - Output level, if a message does not meet the level it will not be logged
   * @param {Boolean} [options.short] - Enable short level tags in the output (Cosmetic only)
   * @param {Number}  [options.maxLength] - Length of longest level, used for formatting output (Cosmetic only)
   */
  constructor(tag = 'App', options = {}) {
    this.tag = tag
    /**
     * @deprecated this.options - Default values should be pulled from electron settings
     */
    this.options = Object.assign(options, {
      default: Base.validLevel(options.default) ? options.default : 'INFO',
      level: Base.validLevel(options.level) ? options.level : 'INFO',
      short: options.short || false,
      maxLength: LONGEST_LENGTH
    })
  }

  getTag() {
    return this.tag
  }

  setTag(tag = 'App') {
    this.tag = tag
  }

  /**
   * Compares the message's output level against the current set log level, if it is less than the desired log level it will allow outputting
   *
   * @param {String} outLevel - Output level of the log message
   * @returns {Boolean} True if the output level higher than the current log level
   */
  shouldLog(outLevel) {
    const outIndex = LOG_LEVELS.indexOf(outLevel.trim().toUpperCase())
    const levelIndex = LOG_LEVELS.indexOf(this.options.level.toUpperCase())

    if (levelIndex >= outIndex && levelIndex !== -1) {
      return true
    } else if (levelIndex === -1) {
      return outIndex <= LOG_LEVELS.indexOf(this.options.default.toUpperCase())
    }
    return false
  }

  /**
   * Format the header of the logger
   * ex: '[INFO   ][System]'
   *
   * If this.options.short is enabled, only use the first letter of the log level
   *
   * Ensures that no matter the log level, the log level section will take up the same amount of space
   * ex: [INFO   ], [VERBOSE], [ERROR  ]
   *
   * @param {String} level - Current message log level
   * @param {String} tag - Tag of the log caller
   * @returns A formatted log message header
   */
  formatHeader(level, tag) {
    if (this.options.short) {
      level = level.charAt(0).toUpperCase()
    } else if (this.options.maxLength > level.length) {
      const diff = this.options.maxLength - level.length
      level = level.toUpperCase() + ' '.repeat(diff)
    } else {
      level = level.toUpperCase().slice(0, this.options.maxLength)
    }
    return `[${level}][${tag}]`
  }

  /**
   * Create a formatted timestamp
   *
   * @param {String} [pattern] - Override the date format
   * @returns {String} A Formatted timestamp
   */
  static timestamp(pattern) {
    return `[${moment().format(pattern || 'YY/DD/MM|HH:mm:ss')}]`
  }

  /**
   * Check whether a user set log level is a valid logging level
   *
   * @param {String} desired - Level to check
   * @returns {Boolean} Whether or not the level is a valid log level
   */
  static validLevel(desired = '') {
    return LOG_LEVELS.indexOf(desired.toUpperCase()) !== -1
  }
}
