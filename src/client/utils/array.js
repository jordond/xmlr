export default function flatten([first, ...rest], arr = []) {
  if (first === undefined) {
    return arr
  }

  if (Array.isArray(first) || (first.slice && Array.isArray(first.slice()))) {
    return flatten([...first, ...rest], arr)
  }
  return flatten(rest, [...arr, first])
}
