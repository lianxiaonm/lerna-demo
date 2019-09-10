import React from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode'
import RefsComponent from '../refs-component'
import './style.less'

class QrCode extends RefsComponent {
  static propTypes = {
    ticketCode: PropTypes.string,
  }

  componentDidMount() {
    const { ticketCode } = this.props
    const { qr } = this.$refs
    QRCode.toCanvas(
      qr.querySelector('canvas'),
      ticketCode,
      { errorCorrectionLevel: 'H', version: 8 },
    )
  }

  render() {
    return (
      <div className="mica-tick-qr"
        ref={this.setRefs('qr')}>
        <canvas />
      </div>
    )
  }
}

export default QrCode
