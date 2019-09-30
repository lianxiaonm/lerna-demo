const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  apply(expand) {
    expand.addPlugin([
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
      }),
    ])
    expand.addRuntime(require.resolve('./runtime'))
  },
}
