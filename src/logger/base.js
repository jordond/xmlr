import moment from 'moment'

/**
 * @const {String[]} LOG_LEVELS - Available levels for logging
 */
const LOG_LEVELS = ['ERROR', 'WARN', 'INFO', 'VERBOSE', 'DEBUG', 'SILLY']

/**
 * @const {Number} LONGEST_LENGTH - Length of the longest level, used for keeping consistant output
 */
const LONGEST_LENGTH = 7

export default class Base {
  constructor(tag = 'App', options = {}) {
    this.tag = tag
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

  shouldLog(outLevel) {
    const out = outLevel.trim().toUpperCase()
    const outIndex = LOG_LEVELS.indexOf(out)
    const level = this.options.level.toUpperCase()
    const levelIndex = LOG_LEVELS.indexOf(level)

    if (levelIndex >= outIndex && levelIndex !== -1) {
      return true
    } else if (levelIndex === -1) {
      return outIndex <= LOG_LEVELS.indexOf(this.options.default.toUpperCase())
    }
    return false
  }

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

  static timestamp(pattern) {
    return `[${moment().format(pattern || 'YY/DD/MM|HH:mm:ss')}]`
  }

  static validLevel(desired) {
    if (!desired) {
      return false
    }
    return LOG_LEVELS.indexOf(desired.toUpperCase()) !== -1
  }
}
