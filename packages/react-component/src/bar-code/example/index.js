import React, { PureComponent } from 'react'
import { BarCode } from '@mini-case/react-component'

class BarCodeExample extends PureComponent {
  render() {
    return (
      <div className="example">
        <BarCode ticketCode="1234567890" />
      </div>
    )
  }
}
export default <BarCodeExample />
