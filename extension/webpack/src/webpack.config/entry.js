// webpack entry config
const { getPage, assign, getCommonEntry } = require('../util')
const { runTimes } = require('../config/webpack')

const page = getPage()

module.exports = option => {
  const { watch, hostname, port } = option

  const webpackHot = !watch && process.env.NODE_ENV === 'development'

  const baseEntry = webpackHot ? [
    `webpack-dev-server/client?http://${hostname}:${port}`,
    'webpack/hot/dev-server',
  ] : []

  return Object.keys(page)
    .reduce((entry, name) => assign(entry, {
      [name]: baseEntry.concat(runTimes)
        .concat(page[name].entry),
    }, false), getCommonEntry())
}
