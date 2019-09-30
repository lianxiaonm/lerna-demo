import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import './style.less'

const { string, number, func } = PropTypes

class Toast extends PureComponent {
  static propTypes = {
    content: string.isRequired,
    duration: number,
    cb: func,
  }

  static defaultProps = {
    duration: 2000,
    cb: () => {},
  }

  state = { visible: true }

  timer = -1

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.timer = -1
      this.setState({ visible: false })
      this.props.cb()
    }, this.props.duration)
  }

  componentWillUnmount() {
    if (this.timer !== -1) {
      clearTimeout(this.timer)
    }
  }

  render() {
    const { content } = this.props
    const { visible } = this.state
    return <div className="mica-toast" data-show={visible}>{content}</div>
  }
}

Toast.show = (param, cb) => {
  const props = param || { }
  let toastDom = document.querySelector('#mica-toast')
  if (!toastDom) {
    toastDom = document.createElement('div')
    toastDom.id = 'mica-toast'
    document.body.appendChild(toastDom)
  }
  ReactDOM.unmountComponentAtNode(toastDom)
  ReactDOM.render(<Toast cb={cb} {...props} />, toastDom)
}

export default Toast
