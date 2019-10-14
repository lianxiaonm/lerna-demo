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

exports.getPageConfig = () => {
  const { page: wPage } = webpack
  const nextPage = Object.keys(wPage).length ? wPage : page
  return {
    page: nextPage,
    chunks: Object.keys(nextPage),
  }
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
  const nextEntry = assign(
    { manifest: '', polyfills, vendor: '' },
    commonEntry.reduce((next, source) => {
      const { key, entry } = source
      return assign(next, { [key]: entry })
    }, {}),
    false,
  )
  // 保留manifest的入口文件为runtimeChunk
  delete nextEntry.manifest
  // 保留vendor为commonChunk文件
  delete nextEntry.vendor
  return nextEntry
}
