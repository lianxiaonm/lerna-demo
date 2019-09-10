import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { Modal, QrCode, Icon } from '@mini-case/react-component'
import './style.less'

class ModalCode extends PureComponent {
  state = { visible: false }

  toggle = () => {
    const { visible } = this.state
    this.setState({ visible: !visible })
  }

  close = () => this.setState({ visible: false })

  render() {
    const { visible } = this.state
    return (
      <div className="mica-qrcode">
        <Icon type="qr-code" onClick={this.toggle} />
        <Modal visible={visible} onClose={this.close} spaceClose>
          <Icon type="close" onClick={this.close} />
          <QrCode ticketCode={window.location.href} />
        </Modal>
      </div>
    )
  }
}

const qrcodeDom = document.createElement('div')
qrcodeDom.id = 'mica-qrcode'
document.body.appendChild(qrcodeDom)
ReactDOM.render(<ModalCode />, qrcodeDom)
