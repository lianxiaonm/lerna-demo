/**
 * webpack plugin config (https://www.webpackjs.com/configuration/plugins/)
 */
const ip = require('ip')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const { Plugin: WebpackMildCompile } = require('webpack-mild-compile')

const { env, plugins, heads, bodies, extend } = require('../config/webpack')
const {
  getEnv, getPage, getChunkName, assign,
  getCommonChunk, isEmpty,
} = require('../util')

const page = getPage()

const chunks = Object.keys(page)

const {
  disableCommonChunk = false,
  disableExtractText = false,
  hashDigestLength = 8,
} = extend


module.exports = option => {
  const { watch, livereloadPort } = option
  const filename = getChunkName(option)
  const template = require.resolve('./template.ejs')

  const isCommomChunk = !disableCommonChunk && chunks.length >= 2

  const assignChunk = assign({
    vendor: { chunks: true, minChunks: 2 },
  }, getCommonChunk(), false)

  const commonChunks = Object.keys(assignChunk).slice(1)

  const vendors = isCommomChunk ? ['vendor'] : []

  // 共有文件的打包
  commonChunks.concat(vendors).forEach((name, key) => {
    const { minChunks } = assignChunk[name]
    plugins.push(new webpack.optimize.CommonsChunkPlugin({
      name, filename: `${filename}.js`,
      chunks: key ? chunks : undefined,
      minChunks: isEmpty(minChunks) ? Infinity : minChunks,
    }))
  })

  const htmlChunk = commonChunks.concat(vendors)

  const htmlWebpackPlugins = chunks.map(chunkName => {
    const {
      title = '',
      heads: _heads,
      bodies: _bodies,
    } = page[chunkName]
    return new HtmlWebpackPlugin({
      inject: 'body',
      template, title,
      filename: `${chunkName}.html`,
      chunks: htmlChunk.concat([chunkName]),
      // chunks 排序
      chunksSortMode(chunk1, chunk2) {
        const orderChunk = htmlChunk.concat([chunkName])
        const index1 = orderChunk.indexOf(chunk1.names[0])
        const index2 = orderChunk.indexOf(chunk2.names[0])
        return index1 - index2
      },
      heads: heads.concat(_heads || []),
      bodies: bodies.concat(_bodies || []),
    })
  })

  if (process.env.NODE_ENV === 'production') {
    plugins.push(new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          comparisons: false,
        },
        output: {
          comments: false,
          ascii_only: true,
        },
      },
    }))
    plugins.push(new webpack.HashedModuleIdsPlugin({ hashDigestLength }))
  } else {
    plugins.push(new WebpackMildCompile())

    if (watch) {
      plugins.push(new LiveReloadPlugin({
        hostname: ip.address(),
        port: livereloadPort,
        appendScriptTag: true,
        delay: 500,
      }))
    } else {
      plugins.push(
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
      )
    }
  }

  return [
    new ExtractTextPlugin({
      // devServer 时候，样式内联可以开启 hot-loader
      disable: disableExtractText || (process.env.NODE_ENV === 'development' && !watch),
      filename: `${filename}.css`,
    }),
    new webpack.DefinePlugin(getEnv(env)),
    new CaseSensitivePathsPlugin(),
    ...htmlWebpackPlugins,
    ...plugins,
  ]
}
