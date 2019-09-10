// 插件
exports.plugins = [
  require.resolve('./mc-plugin-workbox'),
  require.resolve('./mc-plugin-init'),
  require.resolve('./mc-plugin-media'),
  require.resolve('./mc-plugin-adapter'),
  require.resolve('./mc-plugin-beta'),
  require.resolve('./mc-plugin-version'),
  require.resolve('./mc-plugin-mock'),
]
// 插件配置
exports.config = { beta: false, version: false, workbox: false }
// webpack 配置
exports.webpack = { }
// 拓展命令
exports.extension = []
