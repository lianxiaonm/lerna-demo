import React from 'react'
import PropTypes from 'prop-types'
import { rem2PX, throttle, featureSupport } from '@mini-case/utils'
import RefsComponent from '../refs-component'
import './style.less'

const { bool, string, number, node, oneOfType } = PropTypes

class Sticky extends RefsComponent {
  static propTypes = {
    simulate: bool, // 是否用 fixed 模拟
    top: oneOfType([string, number]), // rem/PX
    children: node.isRequired,
  }

  static defaultProps = { top: 0, simulate: false }

  static count = 0
  static instances = {}

  static checkSticky() {
    Object.keys(Sticky.instances).forEach(i => {
      const component = Sticky.instances[i]
      if (component) {
        component.setState({ sticky: component.isSticky() })
      }
    })
  }

  constructor(props) {
    super(props)
    const { simulate } = props
    this.index = Sticky.count
    this.state = { sticky: false }
    this.simulate = simulate || !featureSupport('position', 'sticky')
    Sticky.count = this.index + 1
  }

  state = { sticky: false }

  isSticky() {
    const { top } = this.props
    const { root, placeholder } = this.$refs
    let topPX = parseFloat(top)
    if (/rem$/.test(top)) topPX = rem2PX(topPX)
    const { top: placeholderTop } = placeholder.getBoundingClientRect()
    const { height: rootHeight } = root.getBoundingClientRect()
    const { bottom: parentBottom } = root.parentNode.getBoundingClientRect()
    return parentBottom - rootHeight - topPX >= 0 && placeholderTop - topPX <= 1
  }

  scrollHandler = throttle(() => this.setState({ sticky: this.isSticky() }), 16.66667)

  componentDidMount() {
    Sticky.instances[this.index] = this
    if (this.simulate) {
      const { child } = this.$refs
      const { left, width, height } = child.getBoundingClientRect()
      this.left = left
      this.width = width
      this.height = height
    }
    this.setState({ sticky: this.isSticky() }) // eslint-disable-line react/no-did-mount-set-state
    document.addEventListener('scroll', this.scrollHandler, true)
  }

  componentDidUpdate() {
    if (this.simulate) {
      const { child } = this.$refs
      const { left, width, height } = child.getBoundingClientRect()
      this.left = left
      this.width = width
      this.height = height
    }
  }

  componentWillUnmount() {
    delete Sticky.instances[this.index]
    document.removeEventListener('scroll', this.scrollHandler, true)
  }

  render() {
    const { width, height, simulate } = this
    const { top, children } = this.props
    const { sticky } = this.state
    const rootStyle = !simulate ? { top } : null
    const placeholderStyle = (simulate && sticky && width && height) ? { width, height } : null
    const childStyle = (simulate && sticky) ? { left: this.left || 0, top, width: width || '100%' } : null
    return (
      <div className="mica-sticky"
        ref={this.setRefs('root')}
        style={rootStyle}
        data-sticky={sticky}
        data-simulate={simulate}>
        <div ref={this.setRefs('placeholder')} style={placeholderStyle} />
        <div ref={this.setRefs('child')}
          className="child" style={childStyle}>{children}
        </div>
      </div>
    )
  }
}

export default Sticky
