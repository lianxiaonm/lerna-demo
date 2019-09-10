import React, { PureComponent } from 'react'
import { QrCode } from '@mini-case/react-component'

class QrCodeExample extends PureComponent {
  render() {
    return (
      <div className="example">
        <QrCode ticketCode="1234567890" />
      </div>
    )
  }
}
export default <QrCodeExample />
