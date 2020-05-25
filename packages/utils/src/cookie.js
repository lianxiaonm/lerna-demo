const isClient = typeof window !== 'undefined'
const isLegalKey = key => [undefined, null, ''].indexOf(key) === -1

const getSubDomain = () => {
  const { hostname } = window.location
  const domains = hostname.split('.')
  return domains.length > 2 ? domains.slice(-2).join('.') : hostname
}

function tryDecode(str) {
  try {
    return decodeURIComponent(str)
  } catch {
    return str
  }
}

export function parseCookie(params) {
  const { cookie: cookieStr } = isClient ? document : params || {}
  return (cookieStr || '').split(';').reduce((result, pair) => {
    const pairTrim = (pair || '').trim()
    const eqIndex = pairTrim.indexOf('=')
    if (eqIndex > 0) {
      const key = pairTrim.slice(0, eqIndex).trim()
      const value = pairTrim.slice(eqIndex + 1).trim()
      // quoted values
      result[key] = tryDecode(value[0] === '"' ? value.slice(1, -1) : value)
    }
    return result
  }, {})
}


export function createCookie(name, value, days = 365, isSubDomain = true) {
  if (!isClient || !isLegalKey(name)) return
  const optionArr = ['path=/']
  if (isSubDomain) optionArr.unshift(`Domain=${getSubDomain()}`)
  if (!isLegalKey(value)) {
    optionArr.unshift(`Max-Age=${Math.floor(24 * 60 * 60 * -1)}`)
  } else if (!Number.isNaN(+days)) {
    optionArr.unshift(`Max-Age=${Math.floor(24 * 60 * 60 * days)}`)
  }
  optionArr.unshift(`${name}=${encodeURIComponent(value)}`)
  document.cookie = optionArr.join('; ')
}

export function readCookie(name, params) {
  if (isLegalKey(name)) {
    const nameEQ = `${name}=`.trim()
    const { cookie: cookieStr } = isClient ? document : params || {}
    const cookieList = (cookieStr || '').split(';')
    for (let i = 0; i < cookieList.length; i++) {
      const ckTrim = (cookieList[i] || '').trim()
      // startWith
      if (ckTrim.indexOf(nameEQ) === 0) {
        const value = ckTrim.slice(nameEQ.length).trim()
        // quoted values
        return tryDecode(value[0] === '"' ? value.slice(1, -1) : value)
      }
    }
  }
  return null
}

export function matchReadCookie(keyArr, params) {
  const cookieInfo = parseCookie(params)
  return (keyArr || []).reduce((result, item) => {
    const { key, matches } = item
    if (isLegalKey(key)) {
      const value = cookieInfo[key]
      result[key] = matches ? matches(value) : value
    }
    return result
  }, Object.create(null))
}


export function eraseCookie(name) { createCookie(name, '', -1) }
