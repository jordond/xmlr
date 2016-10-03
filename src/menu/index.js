import file from './file'
import edit from './edit'
import view from './view'
import window from './window'
import help from './help'

const IS_DARWIN = process.platform === 'darwin'

function darwin(mainWindow) {
  return [
    file.darwin,
    edit,
    view.darwin(mainWindow),
    window,
    help
  ]
}

function other(mainWindow) {
  return [
    file.other(mainWindow),
    view.other(mainWindow),
    help
  ]
}

function build(mainWindow) {
  if (!mainWindow) {
    throw new Error('Missing mainWindow argument')
  }

  return IS_DARWIN ? darwin(mainWindow) : other(mainWindow)
}

export default { build }
