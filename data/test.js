require('babel-register')
require('babel-polyfill')

console.log('Transpilation enabled, loading script.')
require('./test-xmltojson')
