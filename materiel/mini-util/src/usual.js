function serializeParam(str) {
  const query = {}
  str.split('&')
    .forEach(equation => {
      const equalList = equation.split('=') || []
      const key = equalList[0]
      const value = equalList[1]
      if (value !== undefined) {
        query[decodeURIComponent(key)] = decodeURIComponent(value)
      }
    })
  return query
}

export function getParam() {
  let query = serializeParam(window.location.search.slice(1))
  if (window.location.hash) {
    const index = window.location.hash.indexOf('?')
    if (index > -1) {
      const hashStr = window.location.hash.slice(index + 1)
      query = { ...query, ...serializeParam(hashStr) }
    }
  }
  return query
}

export function paramStr(param, str) {
  return Object.keys(param)
    .map(k => (param[k] ? `${k}=${encodeURIComponent(param[k])}` : ''))
    .filter(k => !!k)
    .join(str || '&')
}

export function buildUrl(url, params) {
  return [url, paramStr(params)].join(/\?/.test(url) ? '&' : '?')
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
  Object.keys(o)
    .forEach(k => {
      if (new RegExp(`(${k})`).test(str)) {
        str = str.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
        )
      }
    })
  return str
}
