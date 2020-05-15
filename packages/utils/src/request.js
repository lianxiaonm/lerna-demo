import { buildUrl } from './transfer'

/**
 * 11: 无权跨域
 * 12: 网络出错
 * 13: 超时
 * 14: 解码失败
 * 19: HTTP 错误
 */
const ErrorEnum = {
  10: '网络出错',
  11: '无权跨域',
  12: '网络出错',
  13: '超时',
  14: '解码失败',
  19: 'HTTP 错误',
}

function getError(type) {
  const text = ErrorEnum[type] || '服务器异常'
  const err = new Error(text)
  err.error = +type
  return err
}

/**
 * @param  {String}   src
 * @param  {Boolean}  removeTag
 * @return {Promise}
 */
export function loadScript(src, removeTag = false, charset) {
  const script = document.createElement('script')
  script.src = src
  if (charset) script.charset = charset
  const clear = () => script.parentNode && script.parentNode.removeChild(script)
  return new Promise((resolve, reject) => {
    script.addEventListener('load', res => {
      if (removeTag) clear()
      resolve(res)
    })
    script.addEventListener('error', () => {
      if (removeTag) clear()
      reject(new Error('script load error'))
    }, false)
    document.head.appendChild(script)
  })
}


// 获取 JSON 数据
export function getJSON({ url, param = {}, timeout = 20000 }) {
  return new Promise((resolve, reject) => {
    const jsonUrl = buildUrl(url, param)
    const xhr = new XMLHttpRequest()
    // 加载完成
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const json = JSON.parse(xhr.responseText)
          resolve(json)
        } catch (e) {
          reject(getError(14))
        }
      } else {
        reject(getError(19))
      }
    })
    // 网络出错
    xhr.addEventListener('error', () => reject(getError(10)))
    // 超时时间设置
    xhr.timeout = timeout
    // 超时错误
    xhr.addEventListener('timeout', () => reject(getError(13)))
    xhr.open('GET', jsonUrl, true)
    xhr.send()
  })
}

let jsonpCount = 0

export function jsonp({ url, param = {}, callbackKey = 'callback', timeout = 20000 }) {
  const callback = `kobe_jsonp_${jsonpCount}`
  const queryParam = { ...param, [callbackKey]: callback }
  const scriptUrl = buildUrl(url, queryParam)

  jsonpCount += 1
  let timer = -1
  // clear timer and callback
  const clear = () => {
    if (timer > 0) clearTimeout(timer)
    if (window[callback]) delete window[callback]
    timer = -1
  }
  return new Promise((resolve, reject) => {
    // 请求超时，置为 13: 超时
    timer = setTimeout(() => reject(getError(13)), timeout)
    // jsonp callback
    window[callback] = res => resolve(res)
    loadScript(scriptUrl, true).then(
      () => {
        // 加载完成但是 callback 未执行，置为 14: 解码失败
        if (window[callback]) reject(getError(14))
      },
      // 脚本加载失败，置为 19: HTTP 错误
      () => reject(getError(19)),
    )
  }).catch(err => {
    throw err
  })
    .finally(() => clear())
}
