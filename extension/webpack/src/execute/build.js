const path = require('path')
const cp = require('child_process')
const chokidar = require('chokidar')
const resolve = require('resolve')
const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const post = require('../config/post')

const { buildCallback, log, getPort } = require('./util')

module.exports = async option => {
  const {
    outputPath = 'dist', publicPath = '',
    watch = false, mode = '', hash = true,
  } = option

  // set env
  let livereloadPort = 35729

  if (watch) {
    livereloadPort = await getPort(livereloadPort)
    process.env.NODE_ENV = 'development'
    process.env.MODE = mode
  } else {
    process.env.NODE_ENV = 'production'
  }

  // set compiler
  const originalConfig = require('../webpack.config')({
    outputPath, publicPath, watch, livereloadPort, hash,
  })

  const webpackConfig = [].concat(post(originalConfig, option))

  const compiler = webpack(webpackConfig)

  compiler.apply(new ProgressBarPlugin())

  // build(watch)
  const { scripts = {} } = require(resolve.sync('./package.json', { basedir: process.cwd() }))
  if (watch) {
    // watch build
    compiler.watch({}, (err, stats) => {
      buildCallback(err, stats)
      if (!stats.hasErrors() && scripts['build:post']) {
        cp.exec('npm run build:post', log)
      }
    })
    // watch mc.config.js
    chokidar.watch(path.resolve('mc.config.js'))
      .on('change', () => process.send('restart'))
  } else {
    // build
    compiler.run((err, stats) => {
      buildCallback(err, stats)
      if (stats.hasErrors()) process.exit(1)

      if (scripts['build:post']) {
        cp.exec('npm run build:post', log)
      }
    })
  }
}
