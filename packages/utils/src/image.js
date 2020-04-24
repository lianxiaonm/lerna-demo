// 暴露出去仅仅是为了方便测试
export function getZoom(width, height, quality, shortSide, cut) {
  if (width === 0 && height === 0) return 'original'
  const param = []
  if (width) param.push(`${width}w`)
  if (height) param.push(`${height}h`)
  if (quality) param.push(`${quality}q`)
  if (shortSide) param.push('1e')
  if (cut) param.push('1c')
  param.push('1l')
  return param.join('_')
}

export function webpFeautre(type) {
  const kTestImages = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
    alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
  }
  const img = new Image()
  return new Promise(resolve => {
    img.onload = () => resolve((img.width > 0) && (img.height > 0))
    img.onerror = () => resolve(false)
    img.src = `data:image/webp;base64,${kTestImages[type]}`
  })
}

let supportWebp = false // 1标识开启

export function checkWebp() {
  Promise.all([
    ['lossy', 'lossless', 'alpha', 'animation'].map(type => webpFeautre(type)),
  ]).then(resultList => { supportWebp = resultList.every(res => !!res) })
}
/**
 * [根据指定参数返回 url]
 * @param  {String}  [img]             [url/djangoId]
 * @param  {Number}  [width=0]         [宽]
 * @param  {Number}  [height=0]        [高]
 * @param  {Number}  [quality=90]      [质量]
 * @param  {Boolean} [shortSide=false] [是否按短边优先]
 * @param  {Boolean} [cut=false]       [是否裁剪]
 * @return {Promise}                   [resolve url]
 */
export function getImage({
  img, width = 0, height = 0,
  quality = 90, shortSide = false, cut = false,
}) {
  const zoom = getZoom(width, height, quality, shortSide, cut)
  return new Promise(resolve => {
    if (/^https?:\/\//.test(img)) {
      img = img.replace(/&amp;/ig, '&')
      if (img.indexOf('.gif') >= 0) {
        // eslint-disable-line
      } else if (img.indexOf('django') !== -1) {
        const res = /(zoom=.*?)(&|$)/.exec(img) // django url
        if (res && res[1]) {
          if (supportWebp) {
            img = img.replace(res[1], `zoom=${zoom}.webp`)
          } else {
            img = img.replace(res[1], `zoom=${zoom}`)
          }
        } else {
          img = `${img}&zoom=${zoom}`
          if (supportWebp) img += '.webp'
        }
      }
    }
    resolve(img)
  })
}

const imageCache = {}

export function loadImage({
  img, width = 0, height = 0,
  quality = 90, shortSide = false, cut = false,
}) {
  return new Promise((resolve, reject) => {
    getImage({ img, width, height, quality, shortSide, cut }).then(image => {
      if (imageCache[image]) resolve(image)
      else {
        const imgEl = new Image()
        imgEl.addEventListener('load', () => {
          imageCache[image] = true
          resolve(image)
        })
        imgEl.addEventListener('error', () => {
          delete imageCache[image]
          reject(new Error('image load error'))
        })
        imgEl.src = image
      }
    })
  })
}
