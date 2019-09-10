const resolve = require('resolve')

exports.safeRequire = path => {
  try {
    return require(path)
  } catch (err) {
    return {}
  }
}

exports.isPlainObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

exports.resolveCwd = module => resolve.sync(module, { basedir: process.cwd() })
