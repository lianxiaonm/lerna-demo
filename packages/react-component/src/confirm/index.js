import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Modal from '../modal'
import './style.less'

const { string, func } = PropTypes

class Confirm extends PureComponent {
  static propTypes = {
    title: string,
    content: string,
    confirmButtonText: string,
    cancelButtonText: string,
    cb: func,
  }

  static defaultProps = {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    cb: () => {},
  }

  state = { visible: true }

  onClose = res => () => {
    const { cb } = this.props
    this.setState({ visible: false }, () => cb(res))
  }

  render() {
    const { title, content, confirmButtonText, cancelButtonText } = this.props
    const { visible } = this.state
    return (
      <Modal className="mica-confirm" visible={visible} spaceClose={false}>
        {title && <span>{title}</span>}
        {content && <span>{content}</span>}
        <div>
          <a onClick={this.onClose({ confirm: false })}>{cancelButtonText}</a>
          <a onClick={this.onClose({ confirm: true })}>{confirmButtonText}</a>
        </div>
      </Modal>
    )
  }
}

Confirm.show = (param = {}, cb) => {
  const props = param || { }
  let confirmDom = document.querySelector('#mica-confirm')
  if (!confirmDom) {
    confirmDom = document.createElement('div')
    confirmDom.id = 'mica-confirm'
    document.body.appendChild(confirmDom)
  }
  ReactDOM.unmountComponentAtNode(confirmDom)
  ReactDOM.render(<Confirm cb={cb} {...props} />, confirmDom)
}

export default Confirm
