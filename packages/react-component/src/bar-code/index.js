import React from 'react'
import PropTypes from 'prop-types'
import JsBarCode from 'jsbarcode'
import RefsComponent from '../refs-component'
import './style.less'

class BarCode extends RefsComponent {
  static propTypes = {
    ticketCode: PropTypes.string,
  }

  componentDidMount() {
    const { ticketCode } = this.props
    const { bar } = this.$refs
    JsBarCode(
      bar.querySelector('canvas'),
      ticketCode,
      { displayValue: false },
    )
  }

  render() {
    return (
      <div className="mica-tick-bar"
        ref={this.setRefs('bar')}>
        <canvas />
      </div>
    )
  }
}

export default BarCode
