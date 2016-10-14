import electronSettings from 'electron-settings'

import { createLogger } from './logger'

export const KEY_LOGGER = 'logger'
export const KEY_MENUBOARD = 'menuboard'
export const KEY_STATE = 'state'

/**
 * Default settings to use for the app
 */
export const defaultSettings = {
  logger: {
    level: 'INFO',
    short: true
  },
  menuboard: {
    version: 'v2'
  },
  state: {
    autosave: false
  }
}

/**
 * Initialize the default settings for the application
 * If in development mode then force some specific values
 */
export async function init() {
  try {
    // Ensure defaults
    electronSettings.defaults(defaultSettings)
    await electronSettings.applyDefaults()

    if (process.env.NODE_ENV === 'development') {
      await electronSettings.set(KEY_LOGGER, { level: 'DEBUG', short: false })
      await electronSettings.set(KEY_STATE, { autosave: true })
    }
  } catch (error) {
    createLogger('Settings').error(`Error creating settings -> ${error.message}`, error)
  }
}

export default electronSettings
