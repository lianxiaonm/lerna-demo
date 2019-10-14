/**
 * webpack plugin config (https://www.webpackjs.com/configuration/plugins/)
 */
const ip = require('ip')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const { Plugin: WebpackMildCompile } = require('webpack-mild-compile')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

// webpack 4 css plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')

const { env, plugins, heads, bodies, extend } = require('../config/webpack')
const { getEnv, getChunkName, getPageConfig, getCommonEntry } = require('../util')

const { page, chunks } = getPageConfig()

const {
  disableCommonChunk = false,
  disableExtractText = false,
  hashDigestLength = 8,
} = extend

const template = require.resolve('./template.ejs')

module.exports = option => {
  const { watch, livereloadPort } = option

  const filename = getChunkName(option)

  const isCommonChunk = !disableCommonChunk && chunks.length > 1

  const commonEntry = getCommonEntry()

  const htmlChunk = isCommonChunk ? [
    'manifest', ...Object.keys(commonEntry), 'vendor',
  ] : ['manifest', ...Object.keys(commonEntry)]

  const htmlWebpackPlugins = chunks.map(chunkName => {
    const { title = '', heads: _heads, bodies: _bodies } = page[chunkName]
    return new HtmlWebpackPlugin({
      inject: 'body',
      template, title,
      filename: `${chunkName}.html`,
      chunks: htmlChunk.concat(chunkName),
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

  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    plugins.push(new UglifyJsPlugin({
      uglifyOptions: {
        compress: { warnings: false, comparisons: false },
        output: { comments: false, ascii_only: true },
      },
    }))
    plugins.push(new webpack.HashedModuleIdsPlugin({ hashDigestLength }))
  } else {
    plugins.push(
      new WebpackMildCompile(),
      // build watch
      watch ? new LiveReloadPlugin({
        hostname: ip.address(), port: livereloadPort,
        appendScriptTag: true, delay: 500,
      }) : new webpack.HotModuleReplacementPlugin(),
    )
  }

  if (!disableExtractText && (isProduction || watch)) {
    // less css 文件处理
    plugins.unshift(
      new MiniCssExtractPlugin({ filename: `${filename}.css` }),
      // 压缩css
      new OptimizeCssPlugin({
        assetNameRegExp: /\.style\.css\.less$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true,
      }),
    )
  }

  return [
    new webpack.DefinePlugin(getEnv(env)),
    new CaseSensitivePathsPlugin(),
    new ProgressBarPlugin({ summary: isProduction || watch }),
    ...htmlWebpackPlugins,
    ...plugins,
  ]
}
