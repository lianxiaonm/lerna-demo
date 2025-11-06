import React, { PureComponent } from 'react'
import { LoadMore, LazyLoad, VirtualList } from '@mini-case/react-component'
import './style.less'

const luban = 'https://gw.alipayobjects.com/zos/rmsportal/MMcxjZvIbSUsYeSDsTSo.jpg'
const miyue = 'https://gw.alipayobjects.com/zos/rmsportal/daOxnrbOzRZIjNxhAjgx.jpg'
const zhangliang = 'https://gw.alipayobjects.com/zos/rmsportal/IfqxKhzsEZeGTCpVsNOD.jpg'
const yase = 'https://gw.alipayobjects.com/zos/rmsportal/lDddEQepyUOqwBJsEDws.jpg'
const zhugeliang = 'https://gw.alipayobjects.com/zos/rmsportal/PTEIwVPOtOGzPmaEgmRA.jpg'

const defaultHeroArr = [{
  name: '鲁班',
  logo: luban,
}, {
  name: '芈月',
  logo: miyue,
}, {
  name: '张良',
  logo: zhangliang,
}, {
  name: '亚瑟',
  logo: yase,
}, {
  name: '诸葛亮',
  logo: zhugeliang,
}]

const Column = ({ name, logo }) => (
    <div className="item">
      <h1>{name}</h1>
      <LazyLoad image={logo} shortSide round />
    </div>
)

class LoadMoreExample extends PureComponent {
  state = { heroArr: defaultHeroArr }

  loadMore = () => new Promise(resolve => {
    setTimeout(() => {
      const { heroArr } = this.state
      this.setState({ heroArr: [...heroArr, ...heroArr] }, resolve)
    }, 1000)
  })

  render() {
    const { heroArr } = this.state
    return (
      <div className="load-more-example">
        <VirtualList itemData={heroArr}
          // eslint-disable-next-line react/jsx-no-bind
          getListProps={config => ({
            ...config,
            estimatedItemSize: 300,
            itemSize: () => 300,
          })}
          children={<Column />} />
        <LoadMore showMore={this.loadMore} />
      </div>
    )
  }
}

export default <LoadMoreExample />
