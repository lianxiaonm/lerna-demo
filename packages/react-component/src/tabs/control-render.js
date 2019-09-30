import React, { Component } from 'react' // eslint-disable-line
import PropTypes from 'prop-types'

const { bool, node } = PropTypes

class ControlRender extends Component {
  static propTypes = {
    isUpdate: bool,
    children: node,
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.isUpdate
  }

  render() {
    const { children } = this.props
    return React.Children.toArray(children)[0]
  }
}

export default ControlRender
