function other(mainWindow) {
  return {
    label: '&View',
    submenu: (process.env.NODE_ENV === 'development') ? [{
      label: 'Load saved XML state',
      click() {
        console.log('to be implemented')
      }
    }, {
      label: '&Reload',
      accelerator: 'Ctrl+R',
      click() {
        mainWindow.webContents.reload()
      }
    }, {
      label: 'Toggle &Developer Tools',
      accelerator: 'Alt+Ctrl+I',
      click() {
        mainWindow.toggleDevTools()
      }
    }] : [
      {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          mainWindow.toggleDevTools()
        }
      }
    ]
  }
}

function darwin(mainWindow) {
  return {
    label: 'View',
    submenu: (process.env.NODE_ENV === 'development') ? [{
      label: 'Reload',
      accelerator: 'Command+R',
      click() {
        mainWindow.webContents.reload()
      }
    }] : [{
      label: 'Toggle Developer Tools',
      accelerator: 'Alt+Command+I',
      click() {
        mainWindow.toggleDevTools()
      }
    }]
  }
}

export default { other, darwin }
