import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { passiveSupported } from '@mini-case/utils'
import Spinner from '../spinner'
import './style.less'

const { string, number, oneOf } = PropTypes
const opts = passiveSupported() ? { passive: false, capture: false } : false

class Loading extends PureComponent {
  static propTypes = {
    content: string,
    delay: number,
    type: oneOf([
      'ios',
      'ios-small',
      'bubbles',
      'circles',
      'crescent',
      'dots',
      'lines',
      'ripple',
      'spiral',
      'other',
    ]),
  }

  static defaultProps = { delay: 0 }

  state = { visible: false }

  handleMove = e => e.preventDefault()

  componentWillMount() {
    const { delay } = this.props
    document.addEventListener('touchmove', this.handleMove, opts)
    this.timer = setTimeout(() => this.setState({ visible: true }), delay)
  }

  componentWillUnmount() {
    document.removeEventListener('touchmove', this.handleMove, opts)
    clearTimeout(this.timer)
  }

  render() {
    const { content } = this.props
    const { visible } = this.state
    return (
      <div className="mica-loading" data-visible={visible}>
        <div>
          <Spinner />
          <span>{content}</span>
        </div>
      </div>
    )
  }
}

Loading.show = (param, cb) => {
  const props = param || {}
  let loadingDom = document.querySelector('#mica-loading')
  if (!loadingDom) {
    loadingDom = document.createElement('div')
    loadingDom.id = 'mica-loading'
    document.body.appendChild(loadingDom)
  }
  ReactDOM.unmountComponentAtNode(loadingDom)
  ReactDOM.render(<Loading cb={cb} {...props} />, loadingDom)
}

Loading.hide = () => {
  const loadingDom = document.querySelector('#mica-loading')
  if (loadingDom) ReactDOM.unmountComponentAtNode(loadingDom)
}

export default Loading
