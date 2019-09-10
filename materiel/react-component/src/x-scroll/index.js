import React from 'react'
import PropTypes from 'prop-types'
import { px2PX } from '@mini-case/utils'
import RefsComponent from '../refs-component'
import './style.less'

const { node } = PropTypes

class XScroll extends RefsComponent {
  static propTypes = {
    children: node.isRequired,
  }

  componentDidMount() {
    const { wrap, root } = this.$refs
    const { height } = wrap.getBoundingClientRect()
    root.style.height = `${height - px2PX(10)}px`
  }

  render() {
    const { children } = this.props
    return (
      <div ref={this.setRefs('root')} className="mica-x-scroll">
        <div ref={this.setRefs('wrap')}>{children}</div>
      </div>
    )
  }
}

export default XScroll
