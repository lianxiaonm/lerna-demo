const resolve = require('resolve')

exports.safeRequire = path => {
  try {
    return require(path)
  } catch (err) {
    return { }
  }
}

exports.resolveCwd = module => resolve.sync(module, { basedir: process.cwd() })
