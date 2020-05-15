import { createStore as create } from 'redux'
import { immutable, lodashGet } from '@mini-case/utils'
import { applyMiddleware } from './middle'

function reducers(current, action) {
  const { type, payload } = action
  const keyArr = (type || '').split('.')
  if (!keyArr.length) {
    console.warn('action type must be defined')
    return current
  }
  return immutable(current, state => {
    const lastKey = keyArr.pop()
    const lastState = lodashGet(keyArr, state)
    lastState[lastKey] = immutable(lastState[lastKey], payload)
  })
}


export function createStore(initialState) {
  const preState = applyMiddleware(initialState)
  return create(reducers, preState)
}
