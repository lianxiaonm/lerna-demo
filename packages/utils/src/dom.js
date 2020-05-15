import { assignTo } from './extend'
import { deserialize } from './transfer'

export function getParam() {
  const query = deserialize(window.location.search.slice(1))
  if (window.location.hash) {
    const index = window.location.hash.indexOf('?')
    if (index > -1) {
      const hashStr = window.location.hash.slice(index + 1)
      return assignTo(query, deserialize(hashStr))
    }
  }
  return query
}

export function isInViewport(node, offset = 0, x = true) {
  const { top, right, bottom, left, width, height } = node.getBoundingClientRect()
  const { clientWidth, clientHeight } = document.documentElement
  // width > 0 || height > 0 is to fix "display: none"
  return (width > 0 || height > 0) && bottom >= -offset && top < (clientHeight + offset)
    && (!x || (right >= -offset && left < (clientWidth + offset)))
}

/**
 * px: 750 视觉稿下单位
 * PX: 页面实际渲染 CSS 像素（兼容页面缩放）
 * rem: rem 值
 * dp: native 单位，相当于未缩放下的 CSS 像素值
 */

// rem-PX
export function rem2PX(rem) {
  const rootStyle = window.getComputedStyle(document.documentElement)
  const fontSize = parseFloat(rootStyle.fontSize)
  return rem * fontSize
}

// px-rem-PX
export function px2PX(px, baseFontSize = 100) {
  return rem2PX(px / baseFontSize)
}

// dp-PX
export function dp2PX(dp) {
  const scale = +document.documentElement.getAttribute('data-scale') || 1
  return dp / scale
}

// PX-dp
export function PX2dp(PX) {
  const scale = +document.documentElement.getAttribute('data-scale') || 1
  return PX * scale
}

export function passiveSupported() {
  let supported = false
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        supported = true
        return supported
      },
    })
    document.addEventListener('test', null, opts)
  } catch (e) { } // eslint-disable-line no-empty
  return supported
}

export function featureSupport(property, value, noPrefixes = false) {
  // Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
  const prop = `${property}:`
  const el = document.createElement('test')
  const mStyle = el.style

  if (!noPrefixes) {
    const prefixes = ['-webkit-', ''].join(`${value};${prop}`)
    mStyle.cssText = `${prop}${prefixes}${value};`
  } else {
    mStyle.cssText = `${prop}${value}`
  }
  return mStyle[property].indexOf(value) !== -1
}

/**
 * time（当前时间）
 * start（初始值）
 * offset（变化量）
 * duration（持续时间, ms）
 */
export function easeOut(time, start, offset, duration) {
  const t1 = (time / duration) - 1
  return Math.round((offset * ((t1 ** 3) + 1)) + start)
}

const scrollArr = []

export function scrollBy(container, x, y, milliseconds, cb) {
  let scrollObj = scrollArr.filter(({ el }) => el === container)[0]
  if (!scrollObj) {
    scrollObj = {
      el: container, // 当前 scrollBy 的 Element/window
      done: true, // 当前 scrollBy 动画是否完成
    }
    scrollArr.push(scrollObj)
  }
  scrollObj.t = 1 // 当前帧
  scrollObj.d = Math.ceil((milliseconds / 1000) * 60) // 结束帧
  scrollObj.originX = container === window ? window.scrollX : container.scrollLeft // 当前 x 值
  scrollObj.offsetX = x // x 方向偏移量
  scrollObj.originY = container === window ? window.scrollY : container.scrollTop // 当前 y 值
  scrollObj.offsetY = y // y 方向偏移量
  if (!scrollObj.done) return

  const step = () => {
    const { t, d, originX, originY, offsetX, offsetY, el } = scrollObj
    if (t < d) {
      // 每一帧动画
      const toX = easeOut(t, originX, offsetX, d)
      const toY = easeOut(t, originY, offsetY, d)
      scrollObj.t += 1
      if (el === window) {
        window.scrollTo(toX, toY)
      } else {
        el.scrollLeft = toX // eslint-disable-line
        el.scrollTop = toY // eslint-disable-line
      }
      requestAnimationFrame(step)
    } else {
      // 最后一帧
      scrollObj.done = true
      if (el === window) {
        window.scrollTo(originX + offsetX, originY + offsetY)
      } else {
        el.scrollLeft = originX + offsetX // eslint-disable-line
        el.scrollTop = originY + offsetY // eslint-disable-line
      }
      if (cb) requestAnimationFrame(cb)
    }
  }

  scrollObj.done = false
  step()
}
