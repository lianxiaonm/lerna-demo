import React from 'react'
import { XScroll, LazyLoad } from '@mini-case/react-component'
import './style.less'

const luban = 'https://gw.alipayobjects.com/zos/rmsportal/MMcxjZvIbSUsYeSDsTSo.jpg'
const miyue = 'https://gw.alipayobjects.com/zos/rmsportal/daOxnrbOzRZIjNxhAjgx.jpg'
const zhangliang = 'https://gw.alipayobjects.com/zos/rmsportal/IfqxKhzsEZeGTCpVsNOD.jpg'
const yase = 'https://gw.alipayobjects.com/zos/rmsportal/lDddEQepyUOqwBJsEDws.jpg'
const zhugeliang = 'https://gw.alipayobjects.com/zos/rmsportal/PTEIwVPOtOGzPmaEgmRA.jpg'

export default (
  <div className="x-scroll-example">
    <XScroll>
      <LazyLoad image={luban} />
      <LazyLoad image={miyue} />
      <LazyLoad image={zhangliang} />
      <LazyLoad image={yase} />
      <LazyLoad image={zhugeliang} />
    </XScroll>
  </div>
)
