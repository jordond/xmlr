
const resolve = require('path').resolve
const Promise = require('bluebird')
const xml2js = Promise.promisifyAll(require('xml2js'))

const fs = Promise.promisifyAll(require('fs'))

const V1 = resolve('./data/v1.xml')
const V2 = resolve('./data/v2.xml')

function parseXmlFile(filePath) {
  return fs.readFileAsync(filePath)
    .then(xml2js.parseStringAsync)
    .then(result => result)
}

function loadXMLSaveAsJSONThenBackToXML() {
  const parsed1 = {}
  const parsed2 = {}
  return parseXmlFile(V1)
    .then(x => Object.assign(parsed1, x))
    .then(() => parseXmlFile(V2))
    .then(x => Object.assign(parsed2, x))
    .then(() => {
      console.log('breakpoint')
      const builder = new xml2js.Builder()
      const xmld = builder.buildObject(parsed1)
      console.log('testing back to xml')
      fs.writeFileAsync('./data/js2xml.xml', xmld)
      fs.writeFileAsync('./data/v1.json', JSON.stringify(parsed1, null, 1))
      fs.writeFileAsync('./data/v2.json', JSON.stringify(parsed2, null, 1))
    })
}

loadXMLSaveAsJSONThenBackToXML();

