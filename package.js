/* eslint strict: 0, no-shadow: 0, no-unused-vars: 0, no-console: 0 */

'use strict'

require('babel-polyfill')
const os = require('os')
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const electronCfg = require('./webpack/config.electron.js')
const cfg = require('./webpack/config.production.js')
const packager = require('electron-packager')
const del = require('del')
const exec = require('child_process').exec
const argv = require('minimist')(process.argv.slice(2))
const pkg = require('./package.json')

const deps = Object.keys(pkg.dependencies)
const devDeps = Object.keys(pkg.devDependencies)

const appName = argv.name || argv.n || pkg.productName
const shouldUseAsar = argv.asar || argv.a || false
const shouldBuildAll = argv.all || false

console.log(`shouldUseAsar: ${shouldUseAsar}`)
console.log(`shouldBuildAll: ${shouldBuildAll}`)

const DEFAULT_OPTS = {
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  ignore: [
    '^/test($|/)',
    '^/tools($|/)',
    '^/release($|/)'
  ].concat(devDeps.map(name => `/node_modules/${name}($|/)`))
  .concat(
    deps.filter(name => !electronCfg.externals.includes(name))
      .map(name => `/node_modules/${name}($|/)`)
  )
}

const icon = argv.icon || argv.i || 'src/app'

if (icon) {
  DEFAULT_OPTS.icon = icon
}

const version = argv.version || argv.v

if (version) {
  DEFAULT_OPTS.version = version
  startPack()
} else {
  // use the same version as the currently-installed electron-prebuilt
  exec('npm list electron-prebuilt --dev', (err, stdout) => {
    if (err) {
      DEFAULT_OPTS.version = '1.2.0'
    } else {
      DEFAULT_OPTS.version = stdout.split('electron-prebuilt@')[1].replace(/\s/g, '')
    }

    startPack()
  })
}


function build(cfg) {
  return new Promise((resolve, reject) => {
    webpack(cfg, (err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

function writeTempPackageJson() {
  return new Promise((resolve, reject) => {
    console.log('Writing temporary package.json...')
    fs.writeFile(path.resolve('./src/package.json'), JSON.stringify(pkg, null, 2), (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

function deleteTempPackageJson() {
  return new Promise((resolve, reject) => {
    console.log('Removing temporary package.json...')
    fs.unlink(path.resolve('./src/package.json'), (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

function startPack() {
  console.log('start pack...')
  build(electronCfg)
    .then(() => build(cfg))
    .then(() => del('release'))
    // .then(writeTempPackageJson)
    .then((paths) => {
      if (shouldBuildAll) {
        // build for all platforms
        const archs = ['ia32', 'x64']
        const platforms = ['linux', 'win32', 'darwin']
        console.log(`Building for ${platforms.length} platforms with ${archs.length} archs`)

        const promises = []
        platforms.forEach((plat) => {
          archs.forEach((arch) => {
            promises.push(pack(plat, arch, log(plat, arch)))
          })
        })
        return Promise.all(promises)
      }
      // build for current platform only
      return pack(os.platform(), os.arch(), log(os.platform(), os.arch()))
    })
    // .then(deleteTempPackageJson)
    .catch((err) => {
      console.error(err)
    })
}

function pack(plat, arch, cb) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') return

  const iconObj = {
    icon: DEFAULT_OPTS.icon + (() => {
      let extension = '.png'
      if (plat === 'darwin') {
        extension = '.icns'
      } else if (plat === 'win32') {
        extension = '.ico'
      }
      return extension
    })()
  }

  const opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
    platform: plat,
    arch,
    prune: true,
    'app-version': pkg.version || DEFAULT_OPTS.version,
    out: `release/${plat}-${arch}`
  })

  return new Promise((resolve, reject) => {
    packager(opts, (err, filepath) => {
      cb(err, filepath)
      if (err) return reject(err)
      return resolve()
    })
  })
}


function log(plat, arch) {
  return (err, filepath) => {
    if (err) return console.error(err)
    console.log(`${plat}-${arch} finished!`)
  }
}
