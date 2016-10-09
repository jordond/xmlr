import { dirname } from 'path'
import { platform } from 'os'

export function splitPath(path, depth = -1) {
  if (depth === -1) {
    return dirname(path)
  }
  const separator = platform() === 'win32' ? '\\' : '/'
  const folders = path.split(dirname(separator))
  return folders.slice(folders.length - (depth + 1), folders.length).join(separator)
}

export function cleanUnderscoresAndTrim(string) {
  return string.replace(/_/g, ' ').trim()
}

export function getLastWord(string, checkForNumberPrefix = true) {
  const words = string.split(' ')
  let offset = isNaN(words[words.length - 2]) ? 1 : 2
  if (!checkForNumberPrefix) {
    offset = 1
  }
  return words.slice(words.length - offset, words.length).join(' ')
}

/**
 * Take an array of strings and find a common prefix for them
 * @param {string[]} [strings=[]] - Strings to check
 * @returns String - Common prefix from the strings
 */
export function findPrefix(strings = []) {
  if (strings.length <= 1) {
    return ''
  }
  let largest = strings[0]
  let smallest = strings[strings.length - 1]

  for (const s of strings) {
    largest = largest < s ? s : largest
    smallest = smallest > s ? s : smallest
  }

  const length = Math.min(largest.length, smallest.length)
  let prefixIndex = 0
  while (prefixIndex < length && largest[prefixIndex] === smallest[prefixIndex]) {
    prefixIndex += 1
  }

  return largest.slice(0, prefixIndex)
}
