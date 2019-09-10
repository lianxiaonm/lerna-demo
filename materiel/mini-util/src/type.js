const { toString: toStr } = Object
const clz2type = {}
const Undefined = undefined
const typeArray = 'array'
const typeString = 'string'
const typeFunc = 'function'
const typeBool = 'boolean'
const typeObject = 'object'
const typeNumber = 'number'
const typeDate = 'date'
const typeRegexp = 'regexp'

export function getType(obj) {
  // typeof null  === 'object'
  if (obj === null) return Undefined
  const typeStr = typeof obj
  const inOf = [typeObject, typeFunc].indexOf(typeStr)
  return inOf > -1 ? clz2type[toStr.call(obj)] || typeObject : typeStr
}

'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' ')
  .forEach(name => {
    clz2type[`[object ${name}]`] = name.toLowerCase()
  })
/**
 * typeof
 */
function isWindow(obj) { return obj && obj.window === obj }
const isArray = Array.isArray || (obj => getType(obj) === typeArray)
function isString(obj) { return getType(obj) === typeString }
function isFunc(obj) { return getType(obj) === typeFunc }
function isBoolean(obj) { return getType(obj) === typeBool }
function isObject(obj) { return typeof obj === 'object' }
function isNumber(obj) { return getType(obj) === typeNumber }
function isDate(obj) { return getType(obj) === typeDate }
function isRegexp(obj) { return getType(obj) === typeRegexp }
function isUndef(obj) { return obj === Undefined }
function isDef(obj) { return obj !== Undefined }
function isNull(obj) { return obj === null || isUndef(obj) }
function isEmpty(obj) { return !(obj && Object.keys(obj).length) }

export default {
  isWindow, isArray, isString, isFunc, isBoolean, isObject,
  isNumber, isDate, isRegexp, isUndef, isDef, isNull, isEmpty,
}
