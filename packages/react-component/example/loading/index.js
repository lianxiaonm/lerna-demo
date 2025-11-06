import React from 'react'
import { Loading } from '@mini-case/react-component'

function onClick() {
  Loading.show()
  setTimeout(() => Loading.hide(), 2000)
}

export default (
  <div className="loading-example">
    <div data-type="btn" onClick={onClick}>倔强青铜（显示）</div>
  </div>
)
