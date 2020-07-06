import React, { useCallback } from 'react'
import {
  useReduxGet, useReduxSet,
} from '@mini-case/immer-redux'
import {
  dateFormat, createCookie, parseCookie,
} from '@mini-case/utils'

import './style.less'

const cookieAction = (dispatch) => {
  dispatch('cookies.@@replace', parseCookie())
}

const useCookie = () => {
  const cookies = useReduxGet('cookies') || { }
  const dispatch = useReduxSet()
  React.useMemo(() => cookieAction(dispatch), [])
  return {
    cookies,
    update: useCallback(({ key, value }) => {
      dispatch(`cookies.${key}`, value)
      createCookie(key, value)
    }, []),
  }
}


const ReduxGet = () => {
  const { cookies, update } = useCookie()
  const addTime = useCallback(() => {
    const dateTime = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
    update({ key: 'time', value: dateTime })
  }, [])
  const delTime = useCallback(() => update({ key: 'time', value: '' }), [])
  React.useEffect(() => {
    let timer = null
    const countDown = () => {
      const dateTime = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
      update({ key: 'time', value: dateTime })
      timer = setTimeout(countDown, 1000)
    }
    timer = setTimeout(countDown, 1000)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="redux-get-example">
      <ul className="cookie-list">
        {Object.keys(cookies).map(key => (
          <li key={key}>
            <span children={key} />
            <span children={cookies[key]} />
          </li>
        ))}
      </ul>
      <div data-type="btn" onClick={addTime} children="update time Cookie" />
      <div data-type="btn" onClick={delTime} children="delete time Cookie" />
    </div>
  )
}

export default <ReduxGet />
