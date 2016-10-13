/**
 * Action events
 */
export const ACTION = 'action:'
export const ACTION_OPEN_FILE = `${ACTION}files:open:file`
export const ACTION_OPEN_FOLDER = `${ACTION}files:open:folder`
export const ACTION_SWITCH_XML = `${ACTION}files:switch`

/**
 * Response Events
 */
export const RESPONSE = ':response'
export const RESPONSE_OPEN_FILE = `${ACTION_OPEN_FILE}${RESPONSE}`
export const RESPONSE_OPEN_FOLDER = `${ACTION_OPEN_FOLDER}${RESPONSE}`
export const RESPONSE_SWITCH_XML = `${ACTION_SWITCH_XML}${RESPONSE}`

/**
 * Log related events
 */
export const LOG_REGISTER = 'logger:ipc:register'
export const LOG_OPTIONS = `${LOG_REGISTER}${RESPONSE}`
export const LOG_MESSAGE = 'logger:ipc:message'

/**
 * Generate a response event string based on the passed in action
 * ex:
 * (action='open:door') => 'open:door:response'
 *
 * @param {String} action
 * @returns String with the response constant appending to it
 */
export function generateResponse(action) {
  return [ACTION, action, RESPONSE].join('')
}

export default {
  generateResponse,
  ACTION,
  ACTION_OPEN_FILE,
  ACTION_OPEN_FOLDER,
  RESPONSE,
  RESPONSE_OPEN_FILE,
  RESPONSE_OPEN_FOLDER,
  LOG_REGISTER,
  LOG_OPTIONS,
  LOG_MESSAGE
}
