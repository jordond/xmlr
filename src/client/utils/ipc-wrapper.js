import { ipcRenderer } from 'electron'

export function sendMessage(action, args, waitForResponse = true, timeout = 0) {
  const promise = new Promise((resolve, reject) => {
    if (!action) {
      return reject('Send: No action was supplied')
    }

    console.log(`Sending ${action}`)
    ipcRenderer.send(action, args)
    if (!waitForResponse) {
      return resolve()
    }
    resolve(recieveMessage(`${action}:response`, timeout))
  })

  return promise
}

export function recieveMessage(event, timeout = 0) {
  const promise = new Promise((resolve, reject) => {
    if (!event) {
      return reject('Recieve: No event was supplied')
    }

    const handler = (result, args) => {
      console.log('Message Received', args)
      return resolve(args)
    }

    ipcRenderer.once(event, handler)
    if (timeout > 0) {
      setTimeout(() => {
        ipcRenderer.removeListener(event, handler)
        return reject('Message timed out')
      }, timeout)
    }
  })

  return promise
}

export function subscribe(event, callback = () => {}) {
  return ipcRenderer.on(event, callback)
}
