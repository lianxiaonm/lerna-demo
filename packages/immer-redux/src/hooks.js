import { useState, useCallback, useRef } from 'react'
import { checkType, immutable } from '@mini-case/utils'

export const useImmutable = initial => {
  const stateRef = useRef(null)
  const [state, setState] = useState(initial)
  stateRef.current = state
  return [state, useCallback((updater) => {
    if (!checkType.isNull(updater)) {
      setState(immutable(stateRef.current, updater))
    }
  }, [])]
}
