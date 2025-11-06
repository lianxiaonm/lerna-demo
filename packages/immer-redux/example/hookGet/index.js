import React, { useCallback } from 'react'
import { useImmutable } from '@mini-case/immer-redux'
import { dateFormat } from '@mini-case/utils'

import './style.less'

const defaultState = { }

const HookGet = () => {
  const [state, setState] = useImmutable(defaultState)

  const delTime = useCallback(() => setState({ 'user.time': '' }), [])
  const addTime = useCallback(() => {
    const dateTime = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
    setState({ 'user.time': dateTime })
  }, [])
  return (
    <div className="hooks-get-example">
      <ul className="state-stringify" children={JSON.stringify(state)} />
      <div data-type="btn" onClick={addTime} children="update time" />
      <div data-type="btn" onClick={delTime} children="delete time" />
    </div>
  )
}

export default <HookGet />
