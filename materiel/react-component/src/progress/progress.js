import PropTypes from 'prop-types'
import { NO_OP } from '@mini-case/utils'
import Lazy from '../lazy'

const { string, number, oneOf, bool, node } = PropTypes

export default class extends Lazy {
  static propTypes = {
    className: string,
    theme: oneOf(['blue', 'orange', 'emerald', 'custom']),
    value: number.isRequired,
    total: number,
    color: string,
    realTime: bool,
    children: node,
  }

  static defaultProps = { total: 100 }

  step = NO_OP

  state = { value: 0, distance: 0 }

  getTime = () => {
    const { distance } = this.state
    const { realTime, total } = this.props
    const result = distance / total * 100
    return realTime ? 0 : Math.floor(
      Math.sqrt(Math.abs(result)) * 200,
    )
  }

  inViewPort = () => {
    const { value, total } = this.props
    const mxValue = Math.min(value, total)
    const { value: value1 } = this.state
    if (mxValue !== value1) {
      this.setState({
        value: Number((+mxValue).toFixed(2)),
        distance: mxValue - value1,
      }, () => this.step())
    }
  }

  componentDidUpdate(preProps) {
    const { total, value } = this.props
    const { total: preTotal, value: preValue } = preProps
    this.equalUpdate(
      { total, value },
      { total: preTotal, value: preValue },
    )
  }
}
