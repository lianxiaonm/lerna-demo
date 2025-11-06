import React, { Component } from 'react'
import { Slider } from '@mini-case/react-component'
import './style.less'

const luban = 'https://gw.alipayobjects.com/zos/rmsportal/MMcxjZvIbSUsYeSDsTSo.jpg'
const miyue = 'https://gw.alipayobjects.com/zos/rmsportal/daOxnrbOzRZIjNxhAjgx.jpg'
const zhangliang = 'https://gw.alipayobjects.com/zos/rmsportal/IfqxKhzsEZeGTCpVsNOD.jpg'
const yase = 'https://gw.alipayobjects.com/zos/rmsportal/lDddEQepyUOqwBJsEDws.jpg'
const zhugeliang = 'https://gw.alipayobjects.com/zos/rmsportal/PTEIwVPOtOGzPmaEgmRA.jpg'

// eslint-disable-next-line react/prop-types
const customPagination = ({ total, currentIndex }) => (
  <div className="custom-pagination">{currentIndex + 1}/{total}</div>
)
// 这个demo主要用来测试pages的数量在1附近跳变带来的影响
class Example extends Component {
  state = {
    // list: [luban, miyue, zhangliang, yase, zhugeliang],
    list: [luban],
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        list: [luban, miyue, zhangliang, yase, zhugeliang],
        // list: [luban],
      })
    }, 4000)
  }

  render() {
    return (
      <div className="slider-example">
        <Slider customPagination={customPagination} loop copyCount={2}>
          {this.state.list.map(item => <img src={item} key={item} alt="" />)}
        </Slider>
      </div>
    )
  }
}

export default (
  <div className="slider-example">
    <h3>autoHeight</h3>
    <Slider autoHeight heightMap={[300, 200, 300, 200, 300]}>
      <img src={luban} alt="" />
      <img src={miyue} alt="" />
      <img src={zhangliang} alt="" />
      <img src={yase} alt="" />
      <img src={zhugeliang} alt="" />
    </Slider>
    <h3>10px gap and 10px lookAhead  10px lookBehind</h3>
    <Slider gap="24px" copyCount={3} loop lookAhead="200px" lookBehind="200px">
      <img src={luban} alt="" />
      <img src={miyue} alt="" />
      <img src={zhangliang} alt="" />
      <img src={yase} alt="" />
      <img src={zhugeliang} alt="" />
    </Slider>
    <h3>10px gap && 30px lookAhead && loop && autoplay=3000</h3>
    <Slider gap="10px" lookAhead="30px" lookBehind="30px">
      <img src={luban} alt="" />
      <img src={miyue} alt="" />
      <img src={zhangliang} alt="" />
      <img src={yase} alt="" />
      <img src={zhugeliang} alt="" />
    </Slider>
    <h3>10px gap</h3>
    <Slider gap="10px">
      <img src={luban} alt="" />
      <img src={miyue} alt="" />
      <img src={zhangliang} alt="" />
      <img src={yase} alt="" />
      <img src={zhugeliang} alt="" />
    </Slider>
    <h3>30px lookAhead</h3>
    <Slider lookAhead="30px">
      <img src={luban} alt="" />
      <img src={miyue} alt="" />
      <img src={zhangliang} alt="" />
      <img src={yase} alt="" />
      <img src={zhugeliang} alt="" />
    </Slider>
    <h3>vertical</h3>
    <Slider direction="vertical">
      <img src={luban} alt="" />
      <img src={miyue} alt="" />
      <img src={zhangliang} alt="" />
      <img src={yase} alt="" />
      <img src={zhugeliang} alt="" />
    </Slider>
    <h3>自定义分页组件</h3>
    <Slider customPagination={customPagination}>
      <img src={luban} alt="" />
      <img src={miyue} alt="" />
      <img src={zhangliang} alt="" />
      <img src={yase} alt="" />
      <img src={zhugeliang} alt="" />
    </Slider>
    <h3>页数在1附近跳变</h3>
    <Example />
  </div>
)
