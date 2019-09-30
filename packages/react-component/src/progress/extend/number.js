import React from 'react'
import { checkType } from '@mini-case/utils'
import Progress from '../progress'

const interval = 1000 / 60
const { isFunc } = checkType

const easeOut = (t, b, c, d, f) => {
  const t1 = t / d - 1
  const ease = c * (t1 * t1 * t1 + 1) + b
  return f ? ease.toFixed(f) : Math.round(ease)
}

export default class Numbers extends Progress {
  step = () => {
    const $this = this
    const { value, distance } = $this.state

    const f = (
      `${value}`.split('.')[1]
      || `${distance}`.split('.')[1]
      || ''
    ).length

    // 起始点
    const start = value - distance
    // 清除循环帧
    if (isFunc(this.$rafFunc)) this.$rafFunc()

    const time = this.getTime()
    let t = 1
    const d = Math.ceil(time / interval)
    ;(function step() {
      const { root } = $this.$refs
      // eslint-disable-next-line
      const toVal = t >= d ? value : easeOut(t++, start, distance, d, f)
      const canStop = distance > 0 ? toVal >= value : toVal <= value
      $this.$rafFunc = canStop ? null : requestAnimationFrame(step)
      if (root instanceof Element) {
        root.innerHTML = canStop ? value : toVal
      }
    }())
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    if (isFunc(this.$rafFunc)) this.$rafFunc()
  }

  render() {
    const { className } = this.props
    const classList = ['mica-progress-number'].concat(className || '')
    return <span className={classList.join(' ')} ref={this.setRefs('root')} />
  }
}
