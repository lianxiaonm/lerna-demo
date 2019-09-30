function getSubDomain() {
  const { hostname } = window.location
  const domains = hostname.split('.')
  return domains.length > 2 ?
    domains.slice(1).join('.') : hostname
}

export function createCookie(
  name, value, days = 365,
  shouldUseSubDomain = false,
) {
  const date = new Date()
  let expires = ''
  if (days) {
    // eslint-disable-next-line no-mixed-operators
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toGMTString()}`
  }
  const domain = shouldUseSubDomain ? `; domain=${getSubDomain()}` : ''
  document.cookie = `${name}=${value}${expires}${domain}; path=/`
}

export function readCookie(name, $document) {
  const { cookie: cookieStr } = typeof document === 'undefined'
    ? $document || { } : document
  const nameEQ = `${name}=`
  let nextCookie = null
  ;(cookieStr || '').split(';').every(ck => {
    const $ck = (ck || '').trim()
    if ($ck.indexOf(nameEQ)) {
      nextCookie = $ck.slice(nameEQ.length)
    }
    return !nextCookie
  })
  return nextCookie
}

export function eraseCookie(name) { createCookie(name, '', -1) }
