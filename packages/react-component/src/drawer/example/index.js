import React, { PureComponent } from 'react'
import { LazyLoad, Drawer } from '@mini-case/react-component'
import './style.less'

const luban = 'https://gw.alipayobjects.com/zos/rmsportal/MMcxjZvIbSUsYeSDsTSo.jpg'
const miyue = 'https://gw.alipayobjects.com/zos/rmsportal/daOxnrbOzRZIjNxhAjgx.jpg'

class ModalExample extends PureComponent {
  state = {
    visible: false,
  }

  showDrawer = () => this.setState({ visible: true })

  onClose = () => this.setState({ visible: false })

  render() {
    const { visible } = this.state

    return (
      <div className="drawer-example">
        <div data-type="btn" onClick={this.showDrawer}>倔强青铜</div>
        <Drawer visible={visible} onClose={this.onClose}>
          <h1>王者荣耀</h1>
          <LazyLoad image={luban} />
          <LazyLoad image={miyue} />
        </Drawer>
      </div>
    )
  }
}

export default <ModalExample />
