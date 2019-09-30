// webpack devtool

module.exports = () => (process.env.NODE_ENV === 'development' ? 'cheap-module-source-map' : false)
