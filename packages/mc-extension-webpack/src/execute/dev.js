const path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const post = require('../config/post')
const dev = require('../config/dev')
const { getPort, openUrl } = require('./util')

module.exports = async option => {
  const { mode = '', port: commandPort = 8080, publicPath = '/', nohash = false } = option
  const { port: configPort } = dev

  // set env
  process.env.NODE_ENV = 'development'
  process.env.MODE = mode

  // set compiler
  const port = await getPort(configPort || commandPort)

  const originalConfig = require('../webpack.config')({
    hostname: '0.0.0.0', port, hash: !nohash,
  })

  const webpackConfig = [].concat(post(originalConfig, option))

  const compiler = webpack(webpackConfig)

  compiler.apply(new ProgressBarPlugin({ summary: false }))
  compiler.apply(new FriendlyErrorsWebpackPlugin())

  // 第一次编译成功时： 打开页面
  let compiled = false
  compiler.plugin('done', stats => {
    if (!stats.hasErrors() && !compiled) {
      compiled = true
      setImmediate(() => openUrl(port, publicPath))
    }
  })

  // compile and start server
  new WebpackDevServer(compiler, {
    publicPath,
    hot: true,
    compress: true,
    disableHostCheck: true,
    quiet: true,
  }).listen(port, '0.0.0.0')

  // watch mc.config.js
  chokidar.watch(path.resolve('mc.config.js'))
    .on('change', () => process.send('restart'))
}
