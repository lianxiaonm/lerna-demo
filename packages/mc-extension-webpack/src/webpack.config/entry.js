// webpack entry config
const { assign, getCommonEntry, getPageConfig } = require('../util')
const { runTimes } = require('../config/webpack')

const { page, chunks } = getPageConfig()

module.exports = option => {
  const { watch, hostname, port } = option

  const webpackHot = !watch && process.env.NODE_ENV === 'development'

  const baseEntry = webpackHot ? [
    `webpack-dev-server/client?http://${hostname}:${port}`,
    'webpack/hot/dev-server',
    ...runTimes,
  ] : [...runTimes]

  return chunks.reduce((entry, name) => assign(entry, {
    [name]: baseEntry.concat(page[name].entry),
  }, false), getCommonEntry())
}
