const cp = require('child_process')
const path = require('path')
const extend = require('extend2')

const { resolveCwd } = require('./util')
const appConfig = require('./app.config')
const soluConfig = require('./solu.config')


// merge plugin
const initPlugins = [...soluConfig.plugins || [], ...appConfig.plugins || []]
// merge config
const initConfig = extend(true, {}, soluConfig.config, appConfig.config)

const initPluginMap = new Map()
const pluginMap = new Map()
const configMap = new Map()

// 合并解决方案和应用自定义插件，生成 map
// 插件顺序由初始位置决定，相同插件做路径覆盖
initPlugins.forEach(plugin => {
  const beta = /@beta$/.test(plugin)
  if (beta) {
    // 支持 beta 验证自动安装
    console.info(`Download ${plugin}....`.cyan)
    cp.execSync(`npm install ${plugin}`)
  }
  const pluginPath = beta ? resolveCwd(plugin.slice(0, -5)) : resolveCwd(plugin)
  const res = new RegExp(`mc-plugin-([\\w-]+)\\${path.sep}`).exec(pluginPath)
  const pluginName = res && res[1]
  if (pluginName) {
    const { disable } = require(pluginPath)
    const option = initConfig[pluginName]
    if (!disable && option !== false) {
      initPluginMap.set(pluginName, pluginPath)
    } else {
      initPluginMap.delete(pluginName)
    }
  }
})

function resolvePlugin(plugins, stack = []) {
  const parent = stack.length > 0 ? stack[stack.length - 1] : ''
  plugins.forEach(pluginName => {
    // 插件已经在 map 中
    if (pluginMap.has(pluginName)) return
    // 循环依赖
    if (stack.includes(pluginName)) {
      throw new Error(`circular dependency: ${stack},${pluginName}`)
    }
    // 插件不存在
    if (!initPluginMap.has(pluginName)) {
      throw new Error(`${parent} needs ${pluginName}`)
    }

    const pluginPath = initPluginMap.get(pluginName)
    const { plugins: depPlugins, option: defaultOption } = require(pluginPath)
    const option = initConfig[pluginName]

    if (depPlugins) resolvePlugin(depPlugins, [...stack, pluginName])
    pluginMap.set(pluginName, pluginPath)
    configMap.set(pluginName, extend(true, {}, defaultOption, option))
  })
}

resolvePlugin([...initPluginMap.keys()])

const plugins = [...pluginMap.values()]
const config = {}

configMap.forEach((option, key) => { config[key] = option })

module.exports = { plugins, config }
