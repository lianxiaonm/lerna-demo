const serialize = require('serialize-javascript')
const webpack = require('../config/webpack')
const page = require('../config/page')

exports.getEnv = env => {
  const obj = {}
  Object.keys(env).forEach(key => {
    obj[`process.env.${key}`] = serialize(env[key])
  })
  return obj
}

exports.getPage = () => {
  const { page: wPage } = webpack
  // SPA define page
  return Object.keys(wPage).length ? wPage : page
}

const assign = (target, source, override = true) => {
  Object.keys(source).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(target, key) && !override) {
      const message = `${key}: ${target[key]}, but try to replace by ${source[key]}`
      throw new Error(message)
    }
    target[key] = source[key] // eslint-disable-line no-param-reassign
  })
  return target
}

exports.isEmpty = (obj) => [null, undefined].indexOf(obj) > -1

exports.assign = assign

exports.getChunkName = (option) => {
  const { watch, hash } = option
  const webpackHot = !watch && process.env.NODE_ENV === 'development'
  if (hash && webpackHot) return '[name].[hash:6]'
  if (hash) return '[name].[chunkhash:6]'
  return '[name]'
}

exports.getCommonEntry = () => {
  const { polyfills, commonEntry } = webpack
  return assign({
    manifest: require.resolve('../manifest'),
    polyfills,
  }, commonEntry.reduce((entrys, source) => {
    const { key, entry } = source
    return assign(entrys, { [key]: entry })
  }, {}), false)
}

exports.getCommonChunk = () => {
  const { commonEntry } = webpack
  return assign({
    manifest: { minChunks: Infinity },
    polyfills: { minChunks: Infinity },
  }, commonEntry.reduce((entrys, source) => {
    const { key, minChunks } = source
    return assign(entrys, { [key]: { minChunks } })
  }, {}), false)
}
