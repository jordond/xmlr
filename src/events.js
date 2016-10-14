/**
 * Base event paths
 */
export const ACTION = 'action:'
export const RESPONSE = ':response'

/**
 * Xml file dialog events
 *
 * @see files/open.js#onOpenFile | For event options
 */
export const ACTION_OPEN_FILE = `${ACTION}files:open:file`
export const ACTION_OPEN_FOLDER = `${ACTION}files:open:folder`
export const RESPONSE_OPEN_FILE = `${ACTION_OPEN_FILE}${RESPONSE}`
export const RESPONSE_OPEN_FOLDER = `${ACTION_OPEN_FOLDER}${RESPONSE}`

/**
 * Xml switcher events
 *
 * @see files/switcher.js | For event options
 */
export const ACTION_SWITCH_XML = `${ACTION}files:switch`
export const RESPONSE_SWITCH_XML = `${ACTION_SWITCH_XML}${RESPONSE}`

/**
 * Log related events
 *
 * @see client/utils/logger#register | For Register, and options implementation
 * @see main.js#onReady | For options implementation
 * @see client/utils/logger#handleMessage | For message implementation
 */
export const LOG_REGISTER = 'logger:ipc:register'
export const LOG_OPTIONS = `${LOG_REGISTER}${RESPONSE}`
export const LOG_MESSAGE = 'logger:ipc:message'

/**
 * State related events
 * TODO - to be implemented
 */
export const STATE_SAVE = `${ACTION}state:save`
export const STATE_LOAD = `${ACTION}state:load`
export const STATE_KEY_XML = 'state:xml'

/**
 * Generate a response event string based on the passed in action
 * ex: (action='open:door') => 'open:door:response'
 *
 * @param {String} action
 * @returns String with the response constant appending to it
 */
export function generateResponse(action) {
  return [ACTION, action, RESPONSE].join('')
}
