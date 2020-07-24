const redis = require('redis')
const EventEmitter = require('events')
const JSONB = require('json-buffer')

const { stringify: serialize, parse: deserialize } = JSONB

const retryStrategy = (name, options) => {
  console.log(`${name} client options.attempt`, options.attempt)
  if (options.total_retry_time > 1000 * 60 * 60) {
    return new Error('Retry time exhausted')
  }
  return Math.max(options.attempt * 100, 2000)
}

class RedisKeyV extends EventEmitter {
  constructor(config) {
    super()
    const { write, read } = config
    if (!write.host || !read.host) throw new Error('redis config must be host')
    this.readClient = redis.createClient({
      ...read,
      retry_strategy: retryStrategy.bind(null, 'read'),
    })
    this.writeClient = redis.createClient({
      ...write,
      retry_strategy: retryStrategy.bind(null, 'write'),
    })
    this.onEmitEvent()
  }

  onEmitEvent() {
    // read:0   write:1
    const errorList = [false, false]
    const emitEvent = (index, err) => {
      errorList[index] = !!err
      this.emit('REDIS_STATUS', {
        status: errorList.some(item => !!item),
      })
    }
    this.readClient.on('end', () => emitEvent(0, true))
    this.writeClient.on('end', () => emitEvent(1, true))
    this.readClient.on('connect', () => emitEvent(0))
    this.readClient.on('connect', () => emitEvent(1))
  }

  get(key) {
    return new Promise(resolve => {
      this.readClient.get(key, (err, data) => {
        try {
          if (err || !data) throw new Error('read error')
          resolve(deserialize(data.toString()))
        } catch {
          resolve(undefined)
        }
      })
    })
  }

  set(key, val) {
    return new Promise(resolve => {
      try {
        this.writeClient.set(key, serialize(val), err => resolve(!err))
      } catch {
        resolve(false)
      }
    })
  }

  delete(key) {
    return new Promise(resolve => {
      this.writeClient.del(key, err => resolve(!err))
    })
  }

  clear(prefixKey) {
    return new Promise(resolve => {
      // eslint-disable-next-line consistent-return
      this.readClient.keys(`${prefixKey}*`, (err, data) => {
        if (err) return resolve(err)
        Promise.all((data || []).map(key => this.delete(key))).map(() => resolve())
      })
    })
  }
}

module.exports = RedisKeyV
