// Used to debug using VSCode

require('babel-register')
require('babel-polyfill')

console.log('Launching electron for debug')

require('./src/main')
