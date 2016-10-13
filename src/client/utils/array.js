/**
 * A recursive ES6 array flattener
 *
 * A simple "[].reduce((p, n) => p.concat([...n], [...p])) *could* have been used,
 * however due to the lack of tail call optimization, it could potentially cause a
 * maximum call stack exceeded error, so a different approach was needed
 *
 * ex:
 * flatten([[1, 2, 3], a, [b, c]]) -> [1, 2, 3, a, b, c]
 *
 * @param {Array} [first, ...rest] - Grab the first element from the passed in array
 * @param {Array} [arr=[]] - Array of extra elements
 * @returns {Array} - A flattened array
 */
export default function flatten([first, ...rest], arr = []) {
  if (first === undefined) {
    return arr
  }

  // Check to see if first element in array is an array itself
  // Note: Must also create a shallow copy of the array by calling splice
  // This is needed because of the possibility of a mobx#ObservableArray
  if (Array.isArray(first) || (first.slice && Array.isArray(first.slice()))) {
    return flatten([...first, ...rest], arr)
  }
  return flatten(rest, [...arr, first])
}
