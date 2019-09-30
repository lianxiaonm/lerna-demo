import React from 'react'
import PropTypes from 'prop-types'
import { throttle } from '@mini-case/utils'
import PullElement from 'kobe-pull-element'
import RefsComponent from '../refs-component'
import './style.less'

const { bool, oneOf, node, func, string } = PropTypes

class SwipeAction extends RefsComponent {
  static propTypes = {
    orientation: oneOf(['left', 'right']),
    children: node.isRequired,
    onAction: func.isRequired,
    translateZ: bool,
    jellyAnimation: bool,
    transitionDuration: string,
  }

  static defaultProps = {
    orientation: 'left',
    translateZ: true,
    jellyAnimation: false,
    transitionDuration: '0.3s',
  }

  static count = 0
  static instances = []

  static checkTouch = (e) => {
    const { instances } = SwipeAction
    Object.keys(instances).forEach(i => {
      const component = instances[i] || { }
      const { $refs: { root }, origin } = component
      if (root && !root.contains(e.target) && !origin) {
        component.pullElement.animateToOrigin()
        component.origin = true
      }
    })
  }

  constructor(props) {
    super(props)
    if (React.Children.count(props.children) < 2) {
      throw new Error('SwipeAction needs triggerElement and actionElement children')
    }
    this.index = SwipeAction.count
    SwipeAction.count += 1
    this.unmount = false
    this.origin = true
  }

  handleAction = () => {
    const { onAction } = this.props
    onAction().then(() => {
      if (!this.unmount) {
        this.pullElement.animateToOrigin()
        this.origin = true
      }
    })
  }

  componentDidMount() {
    const { orientation, translateZ, jellyAnimation, transitionDuration } = this.props
    const { clientWidth } = this.$refs.action
    const component = this
    this.pullElement = new PullElement({
      target: this.$refs.container,
      wait: false,
      translateZ,
      transitionDuration,
      onPullRight({ translateX }) {
        if (orientation === 'left') {
          if (translateX >= 0) {
            this.preventDefault()
            this.setTranslate(0, 0)
          } else if (jellyAnimation && -translateX > clientWidth) {
            this.preventDefault()
            this.setTranslate(-clientWidth, 0)
          }
        } else if (orientation === 'right') {
          if (translateX > clientWidth) {
            this.preventDefault()
            this.setTranslate(clientWidth, 0)
          } else if (jellyAnimation && translateX <= 0) {
            this.preventDefault()
            this.setTranslate(0, 0)
          }
        }
      },
      onPullLeft({ translateX }) {
        if (orientation === 'left') {
          if (-translateX > clientWidth) {
            this.preventDefault()
            this.setTranslate(-clientWidth, 0)
          } else if (jellyAnimation && translateX >= 0) {
            this.preventDefault()
            this.setTranslate(0, 0)
          }
        } else if (orientation === 'right') {
          if (translateX <= 0) {
            this.preventDefault()
            this.setTranslate(0, 0)
          } else if (jellyAnimation && translateX > clientWidth) {
            this.preventDefault()
            this.setTranslate(clientWidth, 0)
          }
        }
      },
      onPullLeftEnd({ translateX }) {
        if (orientation === 'left') {
          if (-translateX >= 20) {
            this.preventDefault()
            this.animateTo(-clientWidth, 0)
            component.origin = false
          }
        }
      },
      onPullRightEnd({ translateX }) {
        if (orientation === 'right') {
          if (translateX >= 20) {
            this.preventDefault()
            this.animateTo(clientWidth, 0)
            component.origin = false
          }
        }
      },
    })
    this.pullElement.init()
    SwipeAction.instances[this.index] = this
  }

  componentWillUnmount() {
    this.unmount = true
    this.pullElement.destroy()

    // 卸载时，instances 移除当前实例
    delete SwipeAction.instances[this.index]
  }

  render() {
    const { children, orientation } = this.props
    const [triggerElement, actionElement] = React.Children.toArray(children)
    return (
      <div className="mica-swipe-action"
        data-orientation={orientation}
        ref={this.setRefs('root')}>
        <div ref={this.setRefs('container')}>
          <div className="trigger">{triggerElement}</div>
          <div className="action"
            ref={this.setRefs('action')}
            onClick={this.handleAction}>{actionElement}
          </div>
        </div>
      </div>
    )
  }
}
const checkTouch = throttle(SwipeAction.checkTouch, 100)
document.addEventListener('touchstart', checkTouch, false)

export default SwipeAction
