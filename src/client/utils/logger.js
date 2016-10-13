import { sendMessage, subscribe } from './ipc-wrapper'
import { createLogger } from '../../logger'
import { LOG_REGISTER, LOG_MESSAGE } from '../../events'

const DEFAULT_TAG = 'App'
const DEFAULT_OPTIONS = { level: 'INFO', short: false }

/**
 * Create a logger object with the default properties
 * Used to log messages from the main process
 */
let log = create()

/**
 * Global variable to store logger options when they are retrieved
 */
let options = DEFAULT_OPTIONS

/**
 * Creates a new logger object.  If no options are supplied, then it will try to use the
 * global logger settings.  If no logger settings were retrieved from the main process then
 * they will be set to the DEFAULT_OPTIONS constant
 * @see Logger#Console
 *
 * @export
 * @param {String} [tag=DEFAULT_TAG]
 * @param {Object} [logOptions=options]
 * @returns {Console} New instance of the Console logger class
 */
export default function create(tag = DEFAULT_TAG, logOptions = options) {
  return createLogger(tag, logOptions)
}

/**
 * First, subscribe to log messages from the Main Process
 *
 * Send the register event to the main process, and wait for a response containing the logger
 * settings to use.  If this takes longer than 5 seconds, then create the logger with the default settings
 *
 * @return {null} nothing
 */
export async function register() {
  subscribe().to(LOG_MESSAGE).with(handleMessage)

  try {
    const logOptions = await sendMessage(LOG_REGISTER, null, { timeout: 5000 })
    if (logOptions) {
      log = createLogger(DEFAULT_TAG, logOptions)
      options = logOptions
      log.debug('Recieved logger options from Main process', logOptions)
    }
  } catch (err) {
    log = createLogger('Logger', DEFAULT_OPTIONS)
    log.warning(`Unable to get log options -> ${err}`)
  }
}

/**
 * Handles all the log messages from the main process, and prints them to the render process' console
 *
 * @param {Object} event - Sender information
 * @param {Object} details { level, message, data, tag = DEFAULT_TAG }
 * @param {String} details.level - Log level of the message ex: INFO, ERROR, etc
 * @param {String} details.message - Message to print
 * @param {Object} [details.data] - Additional data to print with the message
 * @param {String} [details.tag] - Override the associated tag
 */
function handleMessage(event, { level, message, data, tag = DEFAULT_TAG }) {
  if (tag !== log.getTag()) {
    log.setTag(tag)
  }
  if (level) {
    log.toConsole({ level, message: `Main Process: ${message}`, data })
  }
}
