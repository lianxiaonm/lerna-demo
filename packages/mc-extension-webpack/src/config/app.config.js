const path = require('path')
const { safeRequire } = require('./util')

module.exports = safeRequire(path.resolve('mc.config.js'))
