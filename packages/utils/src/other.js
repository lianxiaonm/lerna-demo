import { toArr } from './extend'

export function debounce(fn, delay) {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, toArr(arguments))
      timer = null
    }, delay)
  }
}

export function throttle(fn, delay) {
  let timer = null
  return function () {
    if (timer === null) {
      timer = setTimeout(() => {
        fn.apply(this, toArr(arguments))
        timer = null
      }, delay)
    }
  }
}
