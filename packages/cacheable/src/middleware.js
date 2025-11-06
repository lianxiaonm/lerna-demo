const getEtag = require('etag')
const JSONB = require('json-buffer')
const prettyMs = require('pretty-ms')
const CacheKeyV = require('./cache')

const { stringify: serialize } = JSONB

const toSeconds = ms => Math.floor(ms / 1000)

const createSetHeaders = ({ revalidate }) => ({
  res, createdAt, isHit, ttl, hasForce, etag, cacheType,
}) => {
  // Specifies the maximum amount of time a resource
  // will be considered fresh in seconds
  let diff = hasForce ? 0 : createdAt + ttl - Date.now()
  diff = diff > 0 ? diff : 0

  res.setHeader(
    'Cache-Control',
    `public, must-revalidate, max-age=${
      toSeconds(diff)
    }, stale-while-revalidate=${
      hasForce ? 0 : toSeconds(revalidate(ttl))
    }`,
  )
  res.setHeader('X-Cache-Type', cacheType)
  res.setHeader('X-Cache-Status', isHit ? 'HIT' : 'MISS')
  res.setHeader('X-Cache-Expired-At', prettyMs(diff))
  res.setHeader('ETag', etag)
}

const defaultResp = { value: undefined, pending: false }

module.exports = config => {
  const {
    namespace,
    redisRead,
    redisWrite,
    ttl: defaultTtl = 1000 * 60 * 10,
    getKey = ctx => [ctx.hostname, ctx.path].join(''),
    ...opts
  } = config
  if (!namespace) throw new Error('config.namespace must be defined')
  const [writeHost, writePort] = (redisWrite || '').split(':')
  const [readHost, readPort] = (redisRead || '').split(':')
  const cache = new CacheKeyV({ namespace, ...opts }, {
    read: { host: readHost, port: readPort },
    write: { host: writeHost, port: writePort },
  })
  const setHeaders = createSetHeaders({ revalidate: ttl => ttl * 0.8 })

  const setCache = async (key, next) => {
    const data = await next()
    const ttl = defaultTtl
    const createdAt = Date.now()
    const etag = getEtag(serialize(data))
    await cache.set(key, { etag, createdAt, ttl, data }, ttl)
    return { etag, createdAt, ttl, data }
  }

  // eslint-disable-next-line consistent-return
  return async (ctx, next) => {
    const key = getKey(ctx)
    const { req, res } = ctx
    const ifNoneMatch = req ? req.headers['if-none-match'] : null
    const hasForce = req ? req.headers['x-force'] : false
    const { value, pending } = hasForce ? defaultResp : await cache.get(key)

    const isHit = !!value

    // cache expire
    if (isHit && pending) setCache(key, next)

    const result = isHit ? value : await setCache(key, next)

    const { etag: cachedEtag, ttl = defaultTtl, createdAt = Date.now(), data } = result
    const etag = cachedEtag || getEtag(serialize(data))
    const cacheType = cache.getCacheType()

    setHeaders({ res, etag, createdAt, isHit, ttl, hasForce, cacheType })

    if (etag === ifNoneMatch) {
      res.statusCode = 304
      res.end()
    } else return data
  }
}
