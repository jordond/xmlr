import moment from 'moment'

const LOG_LEVELS = ['ERROR', 'WARN', 'INFO', 'VERBOSE', 'DEBUG', 'SILLY']

/* eslint no-confusing-arrow: [0] */
function levelsLength(arr = []) {
  const longest = arr.reduce((l, c) => c.length > l.length ? c : l, '')
  return longest.length
}

export default class Base {
  constructor(tag = 'App', options = {}) {
    this.tag = tag
    this.options = Object.assign(options, {
      default: Base.validLevel(options.default) ? options.default : 'INFO',
      level: Base.validLevel(options.level) ? options.level : 'INFO',
      short: options.short || false,
      maxLength: levelsLength(LOG_LEVELS)
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
