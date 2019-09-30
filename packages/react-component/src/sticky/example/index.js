import React, { PureComponent } from 'react'
import { Sticky, LazyLoad } from '@mini-case/react-component'
import tabpanel from '../../tabs/example/tab-panel'
import './style.less'

class StickyExample extends PureComponent {
  state = { cdp: false }

  componentWillMount() {
    setTimeout(() => {
      this.setState({ cdp: 'https://gw.alipayobjects.com/zos/rmsportal/MMcxjZvIbSUsYeSDsTSo.jpg' }, () => {
        Sticky.checkSticky()
      })
    }, 3000)
  }

  render() {
    const { cdp } = this.state
    return (
      <div className="sticky-example">
        {cdp && <LazyLoad className="cdp" image={cdp} />}
        <Sticky className=""><span className="sticky">sticky</span></Sticky>
        {tabpanel}
      </div>
    )
  }
}

export default <StickyExample />
