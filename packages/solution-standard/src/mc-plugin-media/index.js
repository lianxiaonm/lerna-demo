module.exports = {
  option: {
    name: '[name].[hash:6].[ext]',
    limit: 10000,
  },
  apply(expand) {
    const { name, limit, svgSprite } = expand.config.media
    const urlLoader = require.resolve('url-loader')
    const options = { name, limit }
    const rules = [{
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: urlLoader,
      options: { ...options, minetype: 'application/font-woff' },
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: urlLoader,
      options: { ...options, minetype: 'application/font-woff' },
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: urlLoader,
      options: { ...options, minetype: 'application/octet-stream' },
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: urlLoader,
      options: { ...options, minetype: 'application/vnd.ms-fontobject' },
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: urlLoader,
      options: { ...options, minetype: 'image/svg+xml' },
      exclude: svgSprite,
    }, {
      test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
      loader: urlLoader,
      options: { ...options },
    }]
    if (svgSprite) {
      rules.push({
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: require.resolve('svg-sprite-loader'),
        include: svgSprite,
      })
    }
    expand.addRule(rules)
  },
}
