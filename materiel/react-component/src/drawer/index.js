import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Modal from '../modal'
import './style.less'

const { string, number, bool, func, node, oneOfType, any, oneOf } = PropTypes

class Drawer extends PureComponent {
  static propTypes = {
    visible: bool.isRequired,
    className: string,
    duration: oneOfType([string, number]),
    children: node,
    onClose: func,
    backgroundColor: string,
    direction: oneOf(['x', 'y']),
    container: any,
  }

  static defaultProps = {
    className: '',
    direction: 'y',
  }

  render() {
    const { visible, className, duration, backgroundColor, children, onClose,
      container, direction } = this.props
    return (
      <Modal className={`mica-drawer ${className}`}
        container={container}
        direction={direction}
        visible={visible}
        duration={duration}
        backgroundColor={backgroundColor}
        onClose={onClose}>
        {children}
      </Modal>
    )
  }
}

Drawer.show = (param) => {
  const props = param || { }
  let drawerDom = document.querySelector('#mica-drawer')
  if (!drawerDom) {
    drawerDom = document.createElement('div')
    drawerDom.id = 'mica-drawer'
    document.body.appendChild(drawerDom)
  }
  ReactDOM.unmountComponentAtNode(drawerDom)
  ReactDOM.render(<Drawer {...props} />, drawerDom)
}


export default Drawer
