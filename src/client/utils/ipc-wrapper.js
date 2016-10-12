import { ipcRenderer } from 'electron'

import createLogger from './logger'

const TAG = 'IPC'

export function sendMessage(action, args, { wait = true, response, timeout = 0 } = {}) {
  const log = createLogger(TAG)
  const promise = new Promise((resolve, reject) => {
    if (!action) {
      return reject('Send: No action was supplied')
    }

    log.info(`Sending ${action}`)
    ipcRenderer.send(action, args)
    if (!wait) {
      return resolve()
    }
    const responseAction = response || `${action}:response`
    log.debug(`Listening for "${responseAction}"`)
    resolve(recieveMessage(responseAction, timeout))
  })

  return promise
}

export function recieveMessage(event, timeout = 0) {
  const log = createLogger(TAG)
  const promise = new Promise((resolve, reject) => {
    if (!event) {
      return reject('Recieve: No event was supplied')
    }

    const handler = (result, args) => {
      log.verbose(`[${event}] Message Received`, args)
      return resolve(args)
    }

    ipcRenderer.once(event, handler)
    if (timeout > 0) {
      setTimeout(() => {
        ipcRenderer.removeListener(event, handler)
        return reject(`[${event}] Message response timed out`)
      }, timeout)
    }
  })

  return promise
}

export function subscribe(event, callback = () => {}) {
  return ipcRenderer.on(event, callback)
}
