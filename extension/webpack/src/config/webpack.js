const { isPlainObject } = require('./util')
const appConfig = require('./app.config')
const soluConfig = require('./solu.config')

const solutionWebpack = soluConfig.webpack || {}
const appWebpack = appConfig.webpack || {}

const webpack = {
  extend: {}, // 扩展配置
  env: {},
  alias: {},
  external: {},
  commonEntry: [],
  polyfills: [
    require.resolve('es6-promise/auto'),
    require.resolve('regenerator-runtime/runtime'),
  ],
  browsers: [],
  rules: [],
  plugins: [],
  babelPlugins: [],
  postcssPlugins: [],
  heads: [],
  bodies: [],
  runTimes: [],
}

Object.keys(webpack).forEach(key => {
  const defaultValue = webpack[key]
  const def = Array.isArray(defaultValue) ? [] : {}

  const solutionValue = solutionWebpack[key] || def
  const appValue = appWebpack[key] || def

  if (Array.isArray(defaultValue)) { // 数组类型，追加配置
    defaultValue.push(...solutionValue, ...appValue)
  } else if (isPlainObject(defaultValue)) { // 对象类型，可覆盖配置
    Object.assign(defaultValue, solutionValue, appValue)
  }
  webpack[key] = defaultValue
})

// some webpack config for special plugins
webpack.page = {} // spa plugin

module.exports = webpack
