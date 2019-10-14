
const { extend } = require('../config/webpack')
const {
  getPageConfig, getChunkName, getCommonEntry,
} = require('../util')

const { chunks } = getPageConfig()

const {
  disableCommonChunk = false,
} = extend

module.exports = (option) => {
  const isCommonChunk = !disableCommonChunk && chunks.length > 1
  const commonEntry = getCommonEntry()
  delete commonEntry.polyfills
  return {
    runtimeChunk: { name: 'manifest' },
    splitChunks: {
      filename: `${getChunkName(option)}.js`,
      name: (_m, _c, cacheGroupKey) => cacheGroupKey,
      cacheGroups: isCommonChunk ? {
        vendor: { chunks: 'initial', minChunks: 2 },
      } : { },
    },
  }
}
