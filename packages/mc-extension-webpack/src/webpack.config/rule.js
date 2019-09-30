const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
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

exports.styleRule = ({ inline, minimize, sourceMap }) => {
  let cssLoader = [{
    loader: require.resolve('css-loader'),
    options: { minimize, sourceMap, importLoaders: 1 },
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      ident: 'postcss',
      sourceMap,
      plugins: [
        autoprefixer({ browsers }),
        ...postcssPlugins,
      ],
    },
  }]
  let lessLoader = [...cssLoader, {
    loader: require.resolve('less-loader'),
    options: { sourceMap, modifyVars: theme },
  }]
  if (!inline) {
    cssLoader = ExtractTextPlugin.extract({ use: cssLoader })
    lessLoader = ExtractTextPlugin.extract({ use: lessLoader })
  } else {
    const styleLoader = {
      loader: require.resolve('style-loader'),
      options: {
        sourceMap,
        // ensure hot css loads before js
        singleton: true,
      },
    }
    cssLoader = [styleLoader, ...cssLoader]
    lessLoader = [styleLoader, ...lessLoader]
  }

  return [{
    test: /\.css$/, loader: cssLoader,
  }, {
    test: /\.less$/, loader: lessLoader,
  }]
}
