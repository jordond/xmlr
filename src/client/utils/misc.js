import { dirname } from 'path'
import { platform } from 'os'

/**
 * Take a filepath as a string, and return only a few parent directories
 * ex:
 * (path, -1) => /path/to/file/file.txt -> /path/to/file
 * (path, 0) => /path/to/file/file.txt -> file.txt
 * (path, 2) => /path/to/file/file.txt -> to/file/file.txt
 *
 * @param {String} path - Path to manipulate
 * @param {Int} [depth=-1] - How many parent folders to keep, -1 disables
 * @returns The filename with the set number of parent directories
 */
export function splitPath(path, depth = -1) {
  if (depth === -1) {
    return dirname(path)
  }
  const separator = platform() === 'win32' ? '\\' : '/'
  const folders = path.split(dirname(separator))
  return folders.slice(folders.length - (depth + 1), folders.length).join(separator)
}

/**
 * Remove all underscores and trailing white space from a string
 *
 * @param {String} string - String to clean
 * @returns A string without underscores or trailing white space
 */
export function cleanUnderscoresAndTrim(string) {
  return string.replace(/_/g, ' ').trim()
}

/**
 * Find the last word in a string
 *
 * @param {String} string - String to get last word from
 * @param {boolean} [checkForNumberPrefix=true] - Check if the last word is a digit, if so choose the next word
 * @returns The last word found in the string
 */
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
 *
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
