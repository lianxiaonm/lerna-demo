module.exports = () => {
  const { plugins } = require('../config/plugin')
  const expand = require('./expand')

  const pluginList = [...plugins]

  // 根据插件延伸配置
  pluginList.forEach(plugin => {
    const runtime = require(plugin).apply(expand)
    if (runtime) expand.addRuntime(runtime)
  })
}
