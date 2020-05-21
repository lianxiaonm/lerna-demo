import { immutable } from '@mini-case/utils'

const middleList = []

export function addMiddleware() {
  [].slice.call(arguments).forEach(fn => {
    if (typeof fn === 'function') middleList.push(fn)
  })
}

export function applyMiddleware(initState) {
  middleList.reduce(immutable, initState || {})
}
