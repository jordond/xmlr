import { shell } from 'electron'

export default {
  label: 'Help',
  submenu: [{
    label: 'Source Code',
    click() {
      shell.openExternal('http://github.com/jordond/xmlr')
    }
  }, {
    label: 'Documentation',
    click() {
      shell.openExternal('http://github.com/jordond/xmlr#docs')
    }
  }]
}
