import { app } from 'electron'

function other(mainWindow) {
  return {
    label: '&File',
    submenu: [{
      label: '&Open',
      accelerator: 'Ctrl+O'
    }, {
      label: '&Close',
      accelerator: 'Ctrl+W',
      click() {
        mainWindow.close()
      }
    }]
  }
}

const darwin = {
  label: 'Electron',
  submenu: [{
    label: 'About ElectronReact',
    selector: 'orderFrontStandardAboutPanel:'
  }, {
    type: 'separator'
  }, {
    label: 'Services',
    submenu: []
  }, {
    type: 'separator'
  }, {
    label: 'Hide ElectronReact',
    accelerator: 'Command+H',
    selector: 'hide:'
  }, {
    label: 'Hide Others',
    accelerator: 'Command+Shift+H',
    selector: 'hideOtherApplications:'
  }, {
    label: 'Show All',
    selector: 'unhideAllApplications:'
  }, {
    type: 'separator'
  }, {
    label: 'Quit',
    accelerator: 'Command+Q',
    click() {
      app.quit()
    }
  }]
}

export default { darwin, other }
