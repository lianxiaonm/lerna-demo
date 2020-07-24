const JSONB = require('json-buffer')

const { stringify: serialize, parse: deserialize } = JSONB

class MemoryKeyV {
  constructor(opts) {
    this.LRUKey = {}
    this.store = new Map()
    this.opts = { maxCount: 100, ...opts }
  }

  get(key) {
    const data = this.store.get(key)
    return Promise.resolve(typeof data === 'string' ? deserialize(data) : data)
  }

  set(key, value) {
    const { maxCount } = this.opts
    this.store.set(key, serialize(value))
    if (key in this.LRUKey) delete this.LRUKey[key]
    this.LRUKey[key] = true
    Object.keys(this.LRUKey).slice(0, -maxCount)
      .forEach(item => {
        delete this.LRUKey[item]
        this.store.delete(item)
      })
    return Promise.resolve(true)
  }

  delete(key) {
    let result = true
    if (key in this.LRUKey) {
      delete this.LRUKey[key]
      result = this.store.delete(key)
    }
    return Promise.resolve(result)
  }

  clear() {
    this.LRUKey = {}
    this.store.clear()
    return Promise.resolve(true)
  }
}

module.exports = MemoryKeyV
