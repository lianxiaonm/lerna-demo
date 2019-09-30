import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Modal from '../modal'
import './style.less'

const { string, func } = PropTypes

class Alert extends PureComponent {
  static propTypes = {
    title: string,
    content: string,
    buttonText: string,
    cb: func,
  }

  static defaultProps = {
    buttonText: '确定',
  }

  state = { visible: true }

  onClose = () => {
    const { cb } = this.props
    this.setState({ visible: false }, cb)
  }

  render() {
    const { title, content, buttonText } = this.props
    const { visible } = this.state
    return (
      <Modal className="mica-alert" visible={visible} spaceClose={false}>
        {title && <span>{title}</span>}
        {content && <span>{content}</span>}
        <a className="btn" onClick={this.onClose}>{buttonText}</a>
      </Modal>
    )
  }
}

Alert.show = (param, cb) => {
  const props = param || { }
  let alertDom = document.querySelector('#mica-alert')
  if (!alertDom) {
    alertDom = document.createElement('div')
    alertDom.id = 'mica-alert'
    document.body.appendChild(alertDom)
  }
  ReactDOM.unmountComponentAtNode(alertDom)
  ReactDOM.render(<Alert cb={cb} {...props} />, alertDom)
}

export default Alert
