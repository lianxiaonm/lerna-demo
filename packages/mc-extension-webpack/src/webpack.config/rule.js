const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {
  babelPlugins, postcssPlugins,
  extend, browsers: wBrowsers,
} = require('../config/webpack')

const {
  theme = {},
  babelExclude = /node_modules/,
  babelPreset = require.resolve('@mini-case/babel-preset'),
} = extend

const browsers = wBrowsers.length > 0 ? wBrowsers : ['iOS >= 6.0', 'Android >= 4.0']

exports.scriptRule = ({ cacheDirectory, compact }) => [{
  test: /\.js$/,
  exclude: {
    test: babelExclude,
    exclude: { test: /mc-plugin-\w+/ },
  },
  loader: require.resolve('babel-loader'),
  options: {
    babelrc: false,
    presets: [[babelPreset, { browsers, modules: false }]],
    plugins: babelPlugins,
    cacheDirectory,
    compact,
  },
}]

exports.styleRule = ({ inline, sourceMap }) => {
  const cssLoader = [{
    loader: require.resolve('css-loader'),
    options: { sourceMap, importLoaders: 1 },
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      ident: 'postcss', sourceMap, plugins: [
        autoprefixer({ browsers }),
        ...postcssPlugins,
      ],
    },
  }]
  const lessLoader = [...cssLoader, {
    loader: require.resolve('less-loader'),
    options: { sourceMap, modifyVars: theme },
  }]
  const oneLoader = !inline ? {
    loader: MiniCssExtractPlugin.loader,
  } : {
    loader: require.resolve('style-loader'),
    options: { injectType: 'singletonStyleTag' },
  }

  return [{
    test: /\.css$/, loader: [oneLoader, ...cssLoader],
  }, {
    test: /\.less$/, loader: [oneLoader, ...lessLoader],
  }]
}
