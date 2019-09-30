/**
 * webpack module config (https://www.webpackjs.com/configuration/module/)
 */
const { scriptRule, styleRule } = require('./rule')
const { rules, extend } = require('../config/webpack')

const { disableExtractText = false } = extend

module.exports = option => {
  const { watch } = option
  if (process.env.NODE_ENV === 'development') {
    return {
      strictExportPresence: true,
      rules: [
        ...scriptRule(({ cacheDirectory: true, compact: 'auto' })),
        ...styleRule({ inline: !watch, minimize: false, sourceMap: true }),
        ...rules,
      ],
    }
  }
  return {
    strictExportPresence: true,
    rules: [
      ...scriptRule({ cacheDirectory: false, compact: true }),
      ...styleRule({ inline: disableExtractText, minimize: true, sourceMap: false }),
      ...rules,
    ],
  }
}
