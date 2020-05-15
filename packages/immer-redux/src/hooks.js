import { useState, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { checkType, immutable, lodashGet } from '@mini-case/utils'

export function useImmutable(initial) {
  const stateRef = useRef(null)
  const [state, setState] = useState(initial)
  stateRef.current = state
  return [state, useCallback((updater) => {
    if (!checkType.isNull(updater)) {
      setState(immutable(stateRef.current, updater))
    }
  }, [])]
}

export function useReduxGet(key) {
  const makeSelector = useCallback(state => {
    const keyArr = key.split('.')
    const lastKey = keyArr.pop()
    const lastState = lodashGet(keyArr, state)
    return lastState[lastKey]
  }, [key])
  return useSelector(makeSelector)
}

export function useReduxSet() {
  const dispatch = useDispatch()
  return useCallback(
    (type, payload) => dispatch({ type, payload }), [],
  )
}
