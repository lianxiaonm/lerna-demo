const resolve = require('resolve')

exports.safeRequire = path => {
  try {
    return require(path)
  } catch (err) {
    console.error(err)
    return { }
  }
}

exports.resolveCwd = module => resolve.sync(module, { basedir: process.cwd() })
