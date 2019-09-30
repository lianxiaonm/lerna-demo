/**
 * webpack output config (https://www.webpackjs.com/configuration/output/)
 */
const path = require('path')
const webpack = require('../config/webpack')
const { getChunkName } = require('../util')


module.exports = option => {
  const { watch, outputPath, publicPath } = option
  const { output = {} } = webpack.extend
  const filename = `${getChunkName(option)}.js`

  if (!watch && process.env.NODE_ENV === 'development') {
    return { pathinfo: true, filename, ...output }
  }
  return { path: path.resolve(outputPath), publicPath, filename, ...output }
}
