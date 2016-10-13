import { ipcRenderer } from 'electron'

import createLogger from './logger'
import { RESPONSE } from '../../events'

const TAG = 'IPC'

export function sendMessage(action, args, { wait = true, listenFor, timeout = 0 } = {}) {
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
    const responseAction = listenFor || `${action}${RESPONSE}`
    log.debug(`Listening for "${responseAction}"`)
    resolve(recieveMessage(responseAction, timeout))
  })

  return promise
}

export function recieveMessage(channel, timeout = 0) {
  const log = createLogger(TAG)
  const promise = new Promise((resolve, reject) => {
    if (!channel) {
      return reject('Recieve: No channel was supplied')
    }

    const handler = (result, args) => {
      log.verbose(`[${channel}] Message Received`, args)
      return resolve(args)
    }

    ipcRenderer.once(channel, handler)
    if (timeout > 0) {
      setTimeout(() => {
        ipcRenderer.removeListener(channel, handler)
        return reject(`[${channel}] Message response timed out`)
      }, timeout)
    }
  })

  return promise
}

export function subscribe(event, callback) {
  const handler = (channel, cb = () => {}) => ipcRenderer.on(channel, cb)

  let channel
  const object = {
    to: (c) => {
      channel = c
      return object
    },
    with: cb => handler(channel, cb)
  }

  if (event && callback) {
    return handler(event, callback)
  }
  return object
}
