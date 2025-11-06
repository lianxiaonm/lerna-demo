import React, { PureComponent } from 'react'
import { Progress, VirtualList } from '@mini-case/react-component'
import './style.less'

const { BarLine, Circle, Numbers } = Progress

const BarLineItem = ({ value }) => (
  <BarLine value={+value} total={1000} theme="orange">
    <span className="sale-count">{`已售${value}份`}</span>
  </BarLine>
)

const barLineList = [...new Array(200)].map(() => ({
  value: (Math.random() * 800).toFixed(0),
}))

class ProgressExample extends PureComponent {
  render() {
    return (
      <div className="progress-example">
        <div className="circle-example">
          {[...new Array(6)].map((i, k) => {
            const cValue = (Math.random() * 100).toFixed(0)
            return (
              <Circle theme="emerald" value={+cValue} key={k}>
                <Numbers className="numb" value={+cValue} />
              </Circle>
            )
          })}
        </div>
        <VirtualList itemData={barLineList}
          children={<BarLineItem />} />
      </div>
    )
  }
}

export default <ProgressExample />
