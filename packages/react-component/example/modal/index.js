import React, { PureComponent } from 'react'
import { Modal, LazyLoad } from '@mini-case/react-component'
import './style.less'

const luban = 'https://gw.alipayobjects.com/zos/rmsportal/MMcxjZvIbSUsYeSDsTSo.jpg'
const miyue = 'https://gw.alipayobjects.com/zos/rmsportal/daOxnrbOzRZIjNxhAjgx.jpg'

class ModalExample extends PureComponent {
  state = {
    visible: false,
  }

  showModal = () => this.setState({ visible: true })

  onClose = () => this.setState({ visible: false })

  render() {
    const { visible } = this.state

    return (
      <div className="modal-example">
        <div data-type="btn" onClick={this.showModal}>倔强青铜</div>
        <Modal visible={visible} onClose={this.onClose} container=".modal > div">
          <section className="modal">
            <h1>王者荣耀</h1>
            <div>
              <LazyLoad image={luban} />
              <LazyLoad image={miyue} />
            </div>
          </section>
        </Modal>
      </div>
    )
  }
}

export default <ModalExample />
