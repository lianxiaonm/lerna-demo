/* eslint-disable */
const RedisKeyV = require('./redisKeyV')
const MemoryKeyV = require('./memoryKeyV')

const MINUTE = 1000 * 60

class CacheKeyV {
  constructor(opts, config) {
    this.delayKeys = {}
    this.opts = { namespace: 'LRUKeyV', maxCount: 100, ...opts }
    this.initStore(config, this.opts)
  }

  getCacheType() {
    const { store } = this
    if (store instanceof RedisKeyV) return 'r-cache'
    return 'm-cache'
  }

  initStore(config, opts) {
    const memoryStore = new MemoryKeyV(opts)
    try {
      const redisStore = new RedisKeyV(config)
      if (typeof redisStore.on === 'function') {
        redisStore.on('REDIS_STATUS', ({ status }) => {
          // console
          console.log(
            status ? '-redis connect error-,we will fallback memory'
              : '-redis reconnect-,we will use redis',
          )
          this.store = status ? memoryStore : redisStore
        })
      }
      this.store = redisStore
    } catch (err) {
      console.log('redis client init error', err)
      this.store = memoryStore
    }
  }

  _getKeyPrefix(key) {
    return [
      // cache prefix
      process.env.CACHE_PREFIX || '_prefix',
      this.opts.namespace,
      key,
    ].join(':')
  }

  _checkDelayKey(key) {
    if (key in this.delayKeys) {
      const preExpire = this.delayKeys[key]
      if (typeof preExpire === 'number' && Date.now() < preExpire) {
        return true
      }
      delete this.delayKeys[key]
    }
    return false
  }

  get(key) {
    const keyPrefixed = this._getKeyPrefix(key)
    return this.store.get(keyPrefixed).then(data => {
      if ([null, undefined].indexOf(data) === -1) {
        const { expires, value } = data
        if (
          typeof expires === 'number'
          && Date.now() > expires
          && !this._checkDelayKey(key)
        ) {
          // cache delay 1 minute
          const delayExpires = Date.now() + MINUTE
          this.delayKeys[key] = delayExpires
          this.store.set({
            ...data, expires: delayExpires,
          }).then(() => {
            delete this.delayKeys[key]
          })
          return { value, pending: true }
        }
        return { value, pending: false }
      }
      return { value: undefined, pending: false }
    })
  }

  // default 2 minutes ttl
  set(key, value, ttl) {
    const keyPrefixed = this._getKeyPrefix(key)
    if (~~ttl <= 0) ttl = MINUTE * 2
    const expires = typeof ttl === 'number' ? Date.now() + ttl : null
    return this.store.set(keyPrefixed, { value, expires }).then(() => true)
  }

  delete(key) {
    const keyPrefixed = this._getKeyPrefix(key)
    return this.store.delete(keyPrefixed)
  }

  clear() {
    const clearKey = this._getKeyPrefix('')
    return this.store.clear(clearKey)
  }
}

module.exports = CacheKeyV
