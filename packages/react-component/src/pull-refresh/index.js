import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import PullElement from 'kobe-pull-element'
import { throttle } from '@mini-case/utils'
import Progress from '../progress'
import RefsComponent from '../refs-component'
import './style.less'

const { func, node } = PropTypes

const { Circle } = Progress

class PullRefresh extends RefsComponent {
  static propTypes = {
    refresh: func,
    children: node.isRequired,
  }

  state = { percent: 0, refresh: false, disable: false }

  componentDidMount() {
    const { target, scroller, circle } = this.$refs
    const refresh = this.props.refresh || (() => window.location.reload())
    const component = this
    const { top, height } = ReactDOM.findDOMNode(circle).getBoundingClientRect()
    const { top: targetTop } = target.getBoundingClientRect()
    const topFormat = targetTop - top
    const pullElement = new PullElement({
      target,
      scroller,
      detectScroll: true,
      detectScrollOnStart: true,
      onPullDown({ translateY }) {
        component.setState({ percent: ((translateY - topFormat) / 120) * 100 })
      },
      onPullDownEnd() {
        this.preventDefault()
        const { percent } = component.state
        if (percent >= 100) {
          component.setState({ refresh: true })
          this.animateTo(0, topFormat + (topFormat - height) + 30)
            .then(refresh)
            .then(() => this.animateToOrigin())
            .then(() => component.setState({ refresh: false, percent: 0 }))
        } else {
          this.animateToOrigin()
            .then(() => component.setState({ refresh: false, percent: 0 }))
        }
      },
    })
    pullElement.init()
    document.addEventListener('scroll', this.enablePullElement, true)
    document.addEventListener('transitionend', this.enablePullElement, true)
    this.pullElement = pullElement
  }

  enablePullElement = throttle(() => {
    const { pullElement, state: { disable } } = this
    const { scrollY } = window
    const enable = scrollY <= 10
    if (enable === disable) {
      pullElement[!enable ? 'disable' : 'enable']()
      this.setState({ disable: !enable })
    }
  }, 100)

  componentWillUnmount() {
    this.pullElement.destroy()
    document.removeEventListener('scroll', this.enablePullElement, true)
    document.removeEventListener('transitionend', this.enablePullElement, true)
  }

  render() {
    const { children } = this.props
    const { percent, refresh, disable } = this.state
    const newPerCent = percent >= 100 ? 100 : percent
    return (
      <div ref={this.setRefs('target')} className="mica-pull-refresh">
        {refresh ? <i /> : (
          <Circle value={newPerCent < 0 ? 0 : newPerCent}
            ref={this.setRefs('circle')} theme="blue" noLazy realTime />
        )}
        <div ref={this.setRefs('scroller')} className="scroller" data-disable={disable}>{children}</div>
      </div>
    )
  }
}

export default PullRefresh
