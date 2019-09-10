import React, { PureComponent } from 'react'
import { Progress } from '@mini-case/react-component'
import './style.less'

const { BarLine, Circle, Numbers } = Progress

class ProgressExample extends PureComponent {
  render() {
    return (
      <div className="progress-example">
        {[...new Array(6)].map((i, k) => {
          const cValue = (Math.random() * 100).toFixed(0)
          return (
            <Circle theme="emerald" value={+cValue} key={k}>
              <Numbers className="numb" value={+cValue} />
            </Circle>
          )
        })}
        {[...new Array(30)].map((i, k) => {
          const bValue = (Math.random() * 800).toFixed(0)
          return (
            <BarLine value={+bValue} total={1000} key={k}>
              <span className="sale-count">{`已售${bValue}份`}</span>
            </BarLine>
          )
        })}
      </div>
    )
  }
}

export default <ProgressExample />
