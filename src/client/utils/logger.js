import { sendMessage, subscribe } from './ipc-wrapper'
import { createLogger, LOG_REGISTER, LOG_MESSAGE, LOG_OPTIONS } from '../../logger'

const DEFAULT_TAG = 'App'
const DEFAULT_OPTIONS = { level: 'INFO', short: false }

let log = create()
let options = DEFAULT_OPTIONS

export default function create(tag = DEFAULT_TAG, logOptions = options) {
  return createLogger(tag, logOptions)
}

export async function register() {
  subscribe(LOG_MESSAGE, handleMessage)

  try {
    const logOptions = await sendMessage(LOG_REGISTER, null, { response: LOG_OPTIONS, timeout: 5000 })
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

function handleMessage(event, { level, message, data, tag = DEFAULT_TAG }) {
  if (tag !== log.getTag()) {
    log.setTag(tag)
  }
  if (level) {
    log.toConsole({ level, message: `Main Process: ${message}`, data })
  }
}
