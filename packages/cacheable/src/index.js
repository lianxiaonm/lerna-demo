// enable render cache
if (process.env.CACHE_ENABLED === 'true') {
  exports.middleware = require('./middleware')
} else {
  exports.middleware = () => async (ctx, next) => next()
}
