const { safeRequire } = require('./util')
const appConfig = require('./app.config')
const soluConfig = require('./solu.config')

let post = (config) => config

const postCwd = appConfig.post || soluConfig.post

if (postCwd) {
  const postFunc = safeRequire(postCwd)
  if (typeof postFunc === 'function') post = postFunc
}

module.exports = post
