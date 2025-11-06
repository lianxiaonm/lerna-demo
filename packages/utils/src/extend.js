import checkType from './type'

export function valueFn(value) {
  return function () { return value }
}

export const NO_OP = valueFn()

export const trim = String.trim || (
  value => (checkType.isString(value) ? value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : value)
)

export function includes(arr, obj) {
  return [].indexOf.call(arr, obj) !== -1
}

export function toArr(arrLike, start) {
  return [].slice.call(arrLike, start || 0)
}

export function toMap(str, merge, value) {
  const eachArr = checkType.isArray(str) ? str : str.split(',')
  eachArr.forEach(item => {
    merge[item] = checkType.isNull(value) ? true : value
  })
  return merge
}

export function toJson(obj) {
  return checkType.isUndef(obj) ? undefined : JSON.stringify(obj)
}

export function fromJson(json) {
  try {
    return checkType.isString(json) ? JSON.parse(json) : json
  } catch (e) {
    return json
  }
}

export function assignTo() {
  const target = arguments[0] || { }
  toArr(arguments, 1).forEach(item => {
    const keyList = Object.keys(item || {})
    keyList.forEach(key => { target[key] = item[key] })
  })
  return target
}

export function equals(a, b) {
  const aType = checkType.isObject(a)
  const bType = checkType.isObject(b)
  if (aType && aType === bType) {
    const aKey = Object.keys(a)
    const bKey = Object.keys(b)
    if (aKey.length === bKey.length) {
      return Number(aKey.every(key => equals(a[key], b[key])))
    }
  } else if (checkType.isFunc(a) && checkType.isFunc(b)) return true
  return Number(a === b)
}
