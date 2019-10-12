const { safeRequire } = require('./util')
const appConfig = require('./app.config')
const soluConfig = require('./solu.config')

let post = (config) => config

let postFunc = appConfig.post || soluConfig.post

let isBreak = false
do {
  const isFunc = typeof postFunc === 'function'
  isBreak = isFunc || !postFunc
  if (isFunc) post = postFunc
  if (typeof postFunc === 'string') {
    postFunc = safeRequire(postFunc)
  }
} while (!isBreak)


module.exports = post
