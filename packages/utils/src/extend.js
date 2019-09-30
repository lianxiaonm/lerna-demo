import checkType from './type'

const { slice, indexOf } = []

const { isString, isUndef, isArray, isNull, isObject, isFunc } = checkType

export function valueFn(value) {
  return function () { return value }
}

export const NO_OP = valueFn()

export const trim = String.trim || (
  value => (isString(value) ? value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : value)
)

export function includes(arr, obj) {
  return indexOf.call(arr, obj) !== -1
}

export function toArr(arrLike, start) {
  return slice.call(arrLike, start || 0)
}

export function toJson(obj) {
  return isUndef(obj) ? undefined : JSON.stringify(obj)
}

export function fromJson(json) {
  try {
    return isString(json) ? JSON.parse(json) : json
  } catch (e) {
    return json
  }
}

export function toMap(str, merge, value) {
  const eachArr = isArray(str) ? str : str.split(',')
  eachArr.forEach(item => {
    merge[item] = isNull(value) ? true : value
  })
  return merge
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

export function equals(a, b) {
  const aType = isObject(a)
  const bType = isObject(b)
  if (aType && aType === bType) {
    const aKey = Object.keys(a)
    const bKey = Object.keys(b)
    if (aKey.length === bKey.length) {
      return Number(aKey.every(key => equals(a[key], b[key])))
    }
  } else if (isFunc(a) && isFunc(b)) return true
  return Number(a === b)
}
