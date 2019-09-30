import React, { isValidElement, cloneElement } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { passiveSupported } from '@mini-case/utils'
import RefsComponent from '../refs-component'
import Slider from '../slider'
import './style.less'

const { node, number, string } = PropTypes

const opts = passiveSupported() ? { passive: false, capture: false } : false

class Preview extends RefsComponent {
  static propTypes = {
    current: number,
    children: node.isRequired,
    pagination: node,
    viewType: string,
  }

  static defaultProps = { current: 0 }

  initPos = {}

  getPos(e) {
    const targetEvent = e.touches[0]
    return {
      x: targetEvent.clientX,
      y: targetEvent.clientY,
    }
  }

  handleTouchStart = e => {
    this.initPos = this.getPos(e)
  }

  handleTouchMove = e => {
    // e.stopPropagation()
    const container = (
      Array.isArray(this.container) ? this.container : [this.container]
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

      if ((action === 'up' || action === 'down')) e.preventDefault()
    } else e.preventDefault()
  }

  hide = () => {
    const imageViewerDom = document.querySelector('#mica-preview-image')
    ReactDOM.unmountComponentAtNode(imageViewerDom)
  }

  componentDidMount() {
    const { root } = this.$refs
    this.container = [].slice.call(root.querySelectorAll('.kobe-slider'))
    root.addEventListener('touchstart', this.handleTouchStart, false)
    root.addEventListener('touchmove', this.handleTouchMove, opts)
  }

  componentWillUnmount() {
    const { root } = this.$refs
    root.removeEventListener('touchstart', this.handleTouchStart, false)
    root.removeEventListener('touchmove', this.handleTouchMove, opts)
  }

  state = { activeIndex: this.props.current }

  onSlide = i => this.setState({ activeIndex: i })

  render() {
    const { children, current, pagination, viewType } = this.props
    const { activeIndex } = this.state

    const count = React.Children.count(children)

    const isReact = pagination && isValidElement(pagination)

    return (
      <section className="mica-preview-image" data-view={viewType}
        onClick={this.hide} ref={this.setRefs('root')}>
        <span className="title">{`${activeIndex + 1} / ${count}`}</span>
        <Slider pagination={false} initialSlide={current} onSlide={this.onSlide}>
          {children}
        </Slider>
        { isReact && cloneElement(pagination, { activeIndex, count }) }
      </section>
    )
  }
}

Preview.show = (param, cb) => {
  const props = param || { }
  let imageViewerDom = document.querySelector('#mica-preview-image')
  if (!imageViewerDom) {
    imageViewerDom = document.createElement('div')
    imageViewerDom.id = 'mica-preview-image'
    document.body.appendChild(imageViewerDom)
  }
  ReactDOM.unmountComponentAtNode(imageViewerDom)
  ReactDOM.render(<Preview cb={cb} {...props} />, imageViewerDom)
}

export default Preview
