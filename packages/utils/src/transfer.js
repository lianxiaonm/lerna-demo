import produce from 'immer'
import { trim } from './extend'

export function lodashGet(keyArr, state) {
  return keyArr.reduce((middle, key, index) => {
    const nextKey = keyArr[index + 1]
    if (nextKey && !Number.isNaN(+nextKey)) {
      // if current state is Array,we will return
      if (Array.isArray(middle[key])) return middle[key]

      // next key is Number.we will add prefix on key
      const eKey = `$arr_${key}`
      // current state is not Array.we will fix to Array
      if (!Array.isArray(middle[eKey])) middle[eKey] = []
      return middle[eKey]
    }
    // current state is not object.we will fix to object
    if (!(middle[key] instanceof Object)) middle[key] = {}
    return middle[key]
  }, state)
}

export function immutable(current, updater) {
  if (typeof updater === 'function') return produce(current, updater)
  const newState = updater
  return produce(current, state => {
    Object.keys(newState).forEach(key => {
      const keyArr = key.split('.')
      const lastKey = keyArr.pop()
      const lastState = lodashGet(keyArr, state)
      lastState[lastKey] = newState[key]
    })
  })
}

export function serialize(obj, split) {
  return Object.keys(obj)
    .map(k => (obj[k] ? `${k}=${encodeURIComponent(obj[k])}` : ''))
    .filter(k => !!k)
    .join(split || '&')
}

export const paramStr = serialize

function tryDecode(str) {
  try {
    return decodeURIComponent(str)
  } catch {
    return str
  }
}

export function deserialize(str, split) {
  const query = {}
  str.split(split || '&').forEach(equation => {
    const pairTrim = trim(equation)
    const eqIndex = pairTrim.indexOf('=')
    if (eqIndex > 0) {
      const key = pairTrim.slice(0, eqIndex).trim()
      const value = pairTrim.slice(eqIndex + 1).trim()
      if (value !== undefined) query[tryDecode(key)] = tryDecode(value)
    }
  })
  return query
}

export function hashCode(str) {
  return (str || '').split('').reduce((hash, st) => {
    const nHash = (hash << 5) - hash
    return (nHash + st.charCodeAt(0)) | 0
  }, 0)
}

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

export function uuid(len, radix) {
  const $radix = radix || chars.length
  return [...new Array(len || 36)].map((k, i) => {
    const rd = Math.random() * (len ? $radix : 16)
    // eslint-disable-next-line
    const key = len ? 0 | rd : i === 19 ? ((0 | rd) & 0x3) | 0x8 : 0 | rd
    const isSpecial = [8, 13, 18, 23].indexOf(i) > -1
    // eslint-disable-next-line
    const uid = len ? chars[key] : isSpecial ? '-' : i === 14 ? '4' : chars[key]
    return uid
  })
    .join('')
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    // eslint-disable-next-line no-mixed-operators
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function dateFormat(date, fmt = 'yyyy-MM-dd hh:mm') {
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  }

  let str = fmt
  if (/(y+)/.test(fmt)) {
    str = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  Object.keys(o).forEach(k => {
    if (new RegExp(`(${k})`).test(str)) {
      str = str.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      )
    }
  })
  return str
}

export function buildUrl(url, params) {
  return [url, serialize(params)].join(/\?/.test(url) ? '&' : '?')
}
