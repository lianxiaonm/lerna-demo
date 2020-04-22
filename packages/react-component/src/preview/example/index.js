import React from 'react'
import { Preview, LazyLoad } from '@mini-case/react-component'

import './style.less'

const luban = 'https://gw.alipayobjects.com/zos/rmsportal/MMcxjZvIbSUsYeSDsTSo.jpg'
const miyue = 'https://gw.alipayobjects.com/zos/rmsportal/daOxnrbOzRZIjNxhAjgx.jpg'
const zhangliang = 'https://gw.alipayobjects.com/zos/rmsportal/IfqxKhzsEZeGTCpVsNOD.jpg'
const yase = 'https://gw.alipayobjects.com/zos/rmsportal/lDddEQepyUOqwBJsEDws.jpg'
const zhugeliang = 'https://gw.alipayobjects.com/zos/rmsportal/PTEIwVPOtOGzPmaEgmRA.jpg'

function onClick() {
  Preview.show({
    current: 0,
    viewType: 'image',
    children: [luban, miyue, zhangliang, yase, zhugeliang]
      .map((image) => <LazyLoad image={image} />),
  })
}

export default (
  <div className="preview-example">
    <div data-type="btn" onClick={onClick}>倔强青铜</div>
  </div>
)
