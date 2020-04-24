import { parse, serialize } from 'cookie'

const isClient = typeof window !== 'undefined'

const isLegalKey = key => [undefined, null, ''].indexOf(key) === -1
const loadCookie = () => (isClient ? parse(`${document.cookie}`) : null)

let cookieSync = loadCookie()

const getSubDomain = () => {
  const { hostname } = window.location
  const domains = hostname.split('.')
  return domains.length > 2 ? domains.slice(-2).join('.') : hostname
}

export function createCookie(
  name, value, days = 365, isSubDomain = true,
) {
  if (!isClient || isLegalKey(name)) return
  cookieSync[name] = value
  const writeCookie = serialize(name, value, {
    path: '/',
    maxAge: 24 * 60 * 60 * days,
    domain: isSubDomain ? getSubDomain() : undefined,
  })
  document.cookie = writeCookie
}

export function readCookie(name, $doc) {
  if (isLegalKey(name)) {
    if (isClient) return cookieSync[name]
    return parse(`${($doc || { }).cookie}`)[name]
  }
  return null
}

export function reloadCookie() { cookieSync = loadCookie() }

export function eraseCookie(name) { createCookie(name, '', -1) }
