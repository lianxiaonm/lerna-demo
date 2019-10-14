/**
 * webpack output config (https://www.webpackjs.com/configuration/output/)
 */
const path = require('path')
const { extend } = require('../config/webpack')
const { getChunkName } = require('../util')


module.exports = option => {
  const { watch, outputPath, publicPath } = option
  const filename = `${getChunkName(option)}.js`

  if (!watch && process.env.NODE_ENV === 'development') {
    return { filename, ...extend.output }
  }
  return {
    path: path.resolve(outputPath),
    publicPath, filename, ...extend.output,
  }
}
