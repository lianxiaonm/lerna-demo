import React, { PureComponent } from 'react'
import { Amap } from '@mini-case/react-component'
import './style.less'

class AmapExample extends PureComponent {
  render() {
    const point = {
      iLon: 121.544447,
      iLat: 31.206459,
      desLat: '31.206459',
      desLon: 121.554447,
    }
    const { iLon, iLat, desLat, desLon } = point
    return (
      <div className="example">
        <Amap iLon={String(iLon)} iLat={String(iLat)}
          desLon={String(desLon)} desLat={String(desLat)} />
      </div>
    )
  }
}
export default <AmapExample />
