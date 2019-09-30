// 自适应屏幕 + 高清方案
export function adaptive({ baseFontSize = 100, isScale = true, viewportFit = 'cover', pcAdapter = false }) {
  const docEl = document.documentElement
  const ua = navigator.userAgent
  const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i)
  const UCversion = ua.match(/U3\/((\d+|\.){5,})/i)
  const isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80
  const isIOS = navigator.appVersion.match(/(iphone|ipad|ipod)/gi)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  let scale = 1
  if (isScale) {
    let dpr = window.devicePixelRatio || 1
    // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
    if (!isIOS && !(matches && matches[1] > 534) && !isUCHd) dpr = 1
    scale = 1 / dpr
    if (scale < 1) {
      docEl.setAttribute('data-scale', scale)
    } else {
      docEl.removeAttribute('data-scale')
    }
  } else {
    docEl.removeAttribute('data-scale')
  }

  // set meta
  let metaEl = document.querySelector('meta[name="viewport"]')
  if (!metaEl) {
    metaEl = document.createElement('meta')
    metaEl.setAttribute('name', 'viewport')
    document.head.appendChild(metaEl)
  }
  metaEl.setAttribute('content', `width=device-width,user-scalable=no,initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale},viewport-fit=${viewportFit}`)

  const refreshRem = () => {
    let { width } = docEl.getBoundingClientRect()
    if (pcAdapter && !isMobile && width > 750) width = 750
    const rootRem = (width / 750) * baseFontSize
    docEl.style.fontSize = `${rootRem}px`
  }
  window.addEventListener('orientationchange', () => setTimeout(refreshRem, 100))
  refreshRem()
}
