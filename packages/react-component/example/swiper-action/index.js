import React from 'react'
import { SwipeAction } from '@mini-case/react-component'
import './style.less'

const hanleAction = () => Promise.resolve()

export default (
  <div className="swipe-action-example">
    <div className="swipe-action-example-test">
      <SwipeAction onAction={hanleAction}>
        <span>左滑删除</span>
        <span>删除</span>
      </SwipeAction>
    </div>
    <div className="swipe-action-example-test">
      <SwipeAction orientation="right" onAction={hanleAction}>
        <span>右滑删除</span>
        <span>删除</span>
      </SwipeAction>
    </div>
  </div>
)
