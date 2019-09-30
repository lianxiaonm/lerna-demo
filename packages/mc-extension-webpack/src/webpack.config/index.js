
require('../core/index')()

module.exports = option => ({
  bail: process.env.NODE_ENV === 'production',
  devtool: require('./devtool')(option),
  entry: require('./entry')(option),
  output: require('./output')(option),
  resolve: require('./resolve')(option),
  module: require('./module')(option),
  plugins: require('./plugin')(option),
  externals: require('./external')(option),
})
