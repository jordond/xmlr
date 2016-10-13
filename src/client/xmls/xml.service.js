import { sendMessage } from '../utils/ipc-wrapper'
import Events from '../../events'

const defaultOptions = {
  filters: [{
    name: 'Menuboard file', extensions: ['xml']
  }]
}

export function selectTargetXml() {
  const options = {
    ...defaultOptions,
    title: 'Select the target XML file'
  }
  return sendMessage(Events.ACTION_OPEN_FILE, options)
}

export function selectMultipleXMLs() {
  const options = {
    ...defaultOptions,
    title: 'Select the xmls to swap with the target',
    multi: true
  }
  return sendMessage(Events.ACTION_OPEN_FILE, options)
}

export function selectXMLFolder() {
  const options = {
    ...defaultOptions,
    title: 'Select a folder of XMLs',
    folder: true
  }
  return sendMessage(Events.ACTION_OPEN_FOLDER, options)
}

export function switchXML(targetPath, selectedPath) {
  // TODO eventually add functionality to play the swf?
  return sendMessage(Events.ACTION_SWITCH_XML, { targetPath, selectedPath })
}
