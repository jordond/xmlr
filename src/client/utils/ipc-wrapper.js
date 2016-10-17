import { ipcRenderer } from 'electron'

import createLogger from './logger'
import { RESPONSE } from '../../events'

/**
 * @constant {String} TAG - Tag to use in the header of the console output
 */
const TAG = 'IPC'

/**
 * Sends a message using Electron's IPC functionality
 * {@link https://github.com/electron/electron/blob/master/docs/api/ipc-renderer.md}
 *
 * Send the message, and if enabled listen for a response from the Main process.
 * Use for one off messages, if a constant event is required use ipc-wrapper#subscribe
 *
 * @exports sendMessage
 * @param {String} channel - Channel of the event to send ex: 'app:load'
 * @param {Object} [args] - Optional data to send along with the message
 * @param {Object} [options] - Configurable options for the message
 * @param {Boolean} [options.wait=true] - If enabled wait for a response, and send it back to caller
 * @param {String} [options.listenFor] - Event channel to listen for response Note: defaults to 'channel + ":response"'
 * @param {Number} [timeout=0] - Length of time in milliseconds to wait for response, if higher than 0, promise will reject if timeout is reached
 * @returns {Promise} Response from the main thread, or nothing
 */
export function sendMessage(channel, args, { wait = true, listenFor, timeout = 0 } = {}) {
  const log = createLogger(TAG)

  // Create the future promise
  const promise = new Promise((resolve, reject) => {
    if (!channel) {
      return reject('Send: No channel was supplied')
    }

    log.info(`Sending ${channel}`)
    ipcRenderer.send(channel, args)

    // Not waiting, resolve immediately
    if (!wait) {
      return resolve()
    }

    // Forward the #recieveMessage promise
    const responseChannel = listenFor || `${channel}${RESPONSE}`
    log.debug(`Listening for "${responseChannel}"`)
    resolve(recieveMessage(responseChannel, timeout))
  })

  // I promise to resolve :-)
  return promise
}

/**
 * Listen for a response from the Main process
 * Create a one time listener on the main process with the given event channel
 *
 * @exports recieveMessage
 * @param {String} channel - Channel of the event to listen for ex: 'app:load:response'
 * @param {Number} [timeout=0] - Length of time to wait for a response before rejecting the promise
 * @returns {Promise<Object|String>} - Response from the main process, or an error string
 */
export function recieveMessage(channel, timeout = 0) {
  const log = createLogger(TAG)

  // Create the promise
  const promise = new Promise((resolve, reject) => {
    if (!channel) {
      return reject('Recieve: No channel was supplied')
    }

    // Handler for the response from the main process
    const handler = (result, args) => {
      log.verbose(`[${channel}] Message Received`, args)
      return resolve(args)
    }

    // Create a listener for the event
    ipcRenderer.once(channel, handler)

    // If timeout parameter is passed, wait the specified amount of time for a response, if promise is already resolved this will be ignored
    if (timeout > 0) {
      setTimeout(() => {
        // Remove the listener to prevent memory leak
        ipcRenderer.removeListener(channel, handler)
        return reject(`[${channel}] Message response timed out`)
      }, timeout)
    }
  })

  return promise
}

/**
 * Subscribe (listen) to an event
 *
 * A chainable implementation of @see ipcRenderer#on
 * Usage:
 * non-chainable: subscribe('action:open', (x) => console.log(x))
 * chainable:     subscribe().to('action:open').with((x) => console.log(x))
 *
 * @exports subscribe
 * @param {String} [event] - Name of event to listen for
 * @param {Function} [callback] - Function to call when message is received
 * @returns {Object|null} - If no arguments are passed, it will return an object containing chainable methods
 */
export function subscribe(event, callback) {
  const handler = (e, cb = () => {}) => ipcRenderer.on(e, cb)

  // Compose the chainable object
  let channel
  const object = {
    to: (c) => {
      channel = c
      return object
    },
    with: cb => handler(channel, cb)
  }

  // If both arguments were passed return the result of the handler
  if (event && callback) {
    return handler(event, callback)
  }
  return object
}
