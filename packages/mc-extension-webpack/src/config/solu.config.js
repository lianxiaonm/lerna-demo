const path = require('path')
const { safeRequire, resolveCwd } = require('./util')

const { solution: soluConfig } = safeRequire(path.resolve('package.json'))

module.exports = soluConfig ? safeRequire(resolveCwd(soluConfig)) : {}
