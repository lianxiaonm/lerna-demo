const { config } = require('../config/plugin')
const page = require('../config/page')
const webpack = require('../config/webpack')
const { assign } = require('../util')

module.exports = {
  // 插件配置
  config,

  // 页面配置
  page,

  addExtend(extend) {
    assign(webpack.extend, extend)
  },

  addEnv(env) {
    assign(webpack.env, env, false)
  },

  addAlias(alias) {
    assign(webpack.alias, alias)
  },

  addExternal(external) {
    assign(webpack.external, external)
  },

  addPolyfill(polyfill) {
    const polyfills = [].concat(polyfill)
    webpack.polyfills.push(...polyfills)
  },

  addBrowser(browser) {
    const browsers = [].concat(browser)
    webpack.browsers.push(...browsers)
  },

  addRule(rule) {
    const rules = [].concat(rule)
    webpack.rules.push(...rules)
  },

  addPlugin(plugin) {
    const plugins = [].concat(plugin)
    webpack.plugins.push(...plugins)
  },

  addBabelPlugin(babelPlugin) {
    const babelPlugins = [].concat(babelPlugin)
    webpack.babelPlugins.push(...babelPlugins)
  },

  addPostcssPlugin(postcssPlugin) {
    const postcssPlugins = [].concat(postcssPlugin)
    webpack.postcssPlugins.push(...postcssPlugins)
  },

  addHead(head) {
    const heads = [].concat(head)
    webpack.heads.push(...heads)
  },

  addBody(body) {
    const bodies = [].concat(body)
    webpack.bodies.push(...bodies)
  },

  addRuntime(runtime) {
    const runTimes = [].concat(runtime)
    webpack.runTimes.push(...runTimes)
  },

  addPage(pages) {
    assign(webpack.page, pages)
  },

  addCommonEntry(entry, index) {
    const entrys = [].concat(entry)
    if ([null, undefined].indexOf(index) > -1) {
      webpack.commonEntry.push(...entrys)
    } else {
      webpack.commonEntry.splice(index, 0, ...entrys)
    }
  },
}
