import React from 'react'
import PropTypes from 'prop-types'
import { passiveSupported, checkType } from '@mini-case/utils'
import Animate from '../animate'
import RefsComponent from '../refs-component'
import Lazy from '../lazy'
import './style.less'

const { isString, isNumber, isArray } = checkType

const { bool, string, number, node, func, any, oneOf, oneOfType } = PropTypes

const opts = passiveSupported() ? { passive: false, capture: false } : false

export default class Modal extends RefsComponent {
  static propTypes = {
    visible: bool.isRequired,
    children: node.isRequired,
    spaceClose: bool,
    onClose: func,
    duration: oneOfType([string, number]),
    direction: oneOf(['x', 'y']),
    container: any,
    className: string,
    backgroundColor: string,
  }

  static defaultProps = {
    spaceClose: true,
    duration: '0.2s',
    direction: 'y',
    className: '',
    onClose: () => {},
  }

  container = null
  initPos = {}

  handleTouchStart = e => {
    this.initPos = this.getPos(e)
  }

  handleTouchMove = e => {
    const { visible, direction } = this.props
    const container = (
      isArray(this.container) ? this.container : [this.container]
    ).filter(ct => ct && ct.contains(e.target))[0]

    if (container) {
      // get axis and action
      const { x, y } = this.initPos
      const pos = this.getPos(e)
      const deltaX = pos.x - x
      const deltaY = pos.y - y
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)
      const axis = absY >= absX ? 'y' : 'x'
      let action = ''
      if (axis === 'y') {
        if (deltaY > 0) {
          action = 'down'
        } else if (deltaY < 0) {
          action = 'up'
        }
      } else if (axis === 'x') {
        if (deltaX > 0) {
          action = 'right'
        } else if (deltaX < 0) {
          action = 'left'
        }
      }

      const {
        scrollTop, scrollLeft,
        scrollWidth, scrollHeight,
        clientWidth, clientHeight,
      } = container

      if (direction === 'x') {
        if (scrollWidth <= clientWidth ||
          (action === 'up' || action === 'down' || action === '') ||
          (action === 'right' && scrollLeft <= 0) ||
          (action === 'left' && scrollLeft + clientWidth + 1 >= scrollWidth)) {
          e.preventDefault()
        }
      } else if (scrollHeight <= clientHeight ||
        (action === 'left' || action === 'right' || action === '') ||
        (action === 'down' && scrollTop <= 0) ||
        (action === 'up' && scrollTop + clientHeight + 1 >= scrollHeight)) {
        e.preventDefault()
      }
    } else if (visible) {
      e.preventDefault()
    }
  }

  handleClick = e => {
    e.stopPropagation()
    const { spaceClose, onClose } = this.props
    if (spaceClose && e.target === e.currentTarget) onClose()
  }

  componentDidMount() {
    const { root } = this.$refs
    const { container } = this.props
    this.container = isString(container) ?
      [].slice.call(root.querySelectorAll(container)) : container
    root.addEventListener('touchstart', this.handleTouchStart, false)
    root.addEventListener('touchmove', this.handleTouchMove, opts)
  }

  componentDidUpdate() {
    const { root } = this.$refs
    const { visible, duration, container } = this.props
    const milliseconds = this.getMilliseconds(duration)
    this.container = isString(container) ?
      [].slice.call(root.querySelectorAll(container)) : container
    if (visible) setTimeout(Lazy.checkViewport, milliseconds * 2)
  }

  componentWillUnmount() {
    const { root } = this.$refs
    if (root instanceof Element) {
      root.removeEventListener('touchstart', this.handleTouchStart, false)
      root.removeEventListener('touchmove', this.handleTouchMove, opts)
    }
  }

  getPos(e) {
    const targetEvent = e.touches[0]
    return {
      x: targetEvent.clientX,
      y: targetEvent.clientY,
    }
  }

  getMilliseconds(duration) {
    let milliseconds = parseFloat(duration)
    if (isString(duration) && !/ms$/.test(duration)) milliseconds *= 1000
    return milliseconds
  }

  render() {
    const { visible, children, className, backgroundColor } = this.props
    let { duration } = this.props
    if (isNumber(duration)) duration = `${duration}ms`
    const rootStyle = {
      WebkitTransitionDuration: duration,
      transitionDuration: duration,
      backgroundColor,
    }
    const wrapStyle = {
      WebkitTransitionDuration: duration,
      transitionDuration: duration,
    }
    return (
      <Animate showProp="data-show" transitionName="fade" component="div">
        <div className={`mica-modal ${className}`}
          ref={this.setRefs('root')}
          data-show={visible}
          style={rootStyle}
          onClick={this.handleClick}>
          <div className="modal-wrap" style={wrapStyle}>{children}</div>
        </div>
      </Animate>
    )
  }
}
