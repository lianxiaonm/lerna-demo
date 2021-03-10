import React from 'react'
import { Swiper, LazyLoad } from '@mini-case/react-component'
import './style.less'

const luban = 'https://gw.alipayobjects.com/zos/rmsportal/MMcxjZvIbSUsYeSDsTSo.jpg'
const miyue = 'https://gw.alipayobjects.com/zos/rmsportal/daOxnrbOzRZIjNxhAjgx.jpg'
const zhangliang = 'https://gw.alipayobjects.com/zos/rmsportal/IfqxKhzsEZeGTCpVsNOD.jpg'
const yase = 'https://gw.alipayobjects.com/zos/rmsportal/lDddEQepyUOqwBJsEDws.jpg'
const zhugeliang = 'https://gw.alipayobjects.com/zos/rmsportal/PTEIwVPOtOGzPmaEgmRA.jpg'

export default (
  <div className="slider-example">
    <h3>default</h3>
    <Swiper direction="vertical" autoplay={5000} loop>
      <LazyLoad image={luban} />
      <LazyLoad image={miyue} />
      <LazyLoad image={zhangliang} />
      <LazyLoad image={yase} />
      <LazyLoad image={zhugeliang} />
    </Swiper>
    <h3>2个一页</h3>
    <Swiper slidesPerView={2} gap="32px" loop>
      <LazyLoad image={luban} />
      <LazyLoad image={miyue} />
      <LazyLoad image={zhangliang} />
      <LazyLoad image={yase} />
      <LazyLoad image={zhugeliang} />
    </Swiper>
    <h3>2个一页2个分组</h3>
    <Swiper slidesPerView={2} slidesPerGroup={2} autoplay={5000} loop gap="32px">
      <LazyLoad image={luban} />
      <LazyLoad image={miyue} />
      <LazyLoad image={zhangliang} />
      <LazyLoad image={yase} />
      <LazyLoad image={zhugeliang} />
      <div />
    </Swiper>
  </div>
)
