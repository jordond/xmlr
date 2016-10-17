/**
 * @summary Central import file for the many different features of the xml domain
 */

/**
 * @exports XMLPage
 * @description React component that contains all the sub components of the XML route
 */
export XMLPage from './components/xml-page'

/**
 * @exports model
 * @description MobX object containing all the properties of the XML Class
 */
export model from './xml.model'

/**
 * @exports store
 * @description Central store for all of the XML objects
 */
export store from './xml.store'

/**
 * @exports service
 * @description Collection of functions to facilitate the retrieval of XML data
 */
export service from './xml.service'
