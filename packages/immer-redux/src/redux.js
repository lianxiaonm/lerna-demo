import { createStore as create } from 'redux'
import { immutable, lodashGet } from '@mini-case/utils'
import { applyMiddleware } from './middle'

function setReducer(current, action) {
  const { type, payload } = action
  if (/^@@redux/i.test(type)) return current
  const keyArr = (type || '').split('.')
  if (keyArr.length <= 1) throw new Error('action type must be defined')
  return immutable(current, draftState => {
    const lastKey = keyArr.pop()
    const lastState = lodashGet(keyArr, draftState)
    lastState[lastKey] = typeof payload === 'function' ?
      immutable(lastState[lastKey], payload) : payload
  })
}


export function createStore(reducer, initialState, enhancer) {
  const preState = applyMiddleware(initialState)
  return create((current, action) => {
    try {
      return setReducer(current, action)
    } catch {
      return reducer(current, action)
    }
  }, preState, enhancer)
}
