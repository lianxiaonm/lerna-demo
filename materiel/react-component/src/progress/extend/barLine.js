import React from 'react'
import Progress from '../progress'

const barColor = {
  blue: 'linear-gradient(90deg, #57D5FB 0%, #4BB1FB 100%)',
  orange: 'linear-gradient(135deg, #FF8500 0%, #FF5900 100%)',
  emerald: 'linear-gradient(90deg, #0ACCA9 0%, #09D7B8 100%)',
}

export default class BarLine extends Progress {
  static theme = Object.keys(barColor)

  // 线性进度条
  lineStyle(percent, time, color, theme) {
    const { total } = this.props
    const width = ((percent * 100) / total).toFixed(2)
    return {
      width: `${width || 0}%`,
      transitionDuration: time,
      background: `${color || barColor[theme] || '#09C3FF'}`,
    }
  }

  render() {
    const { className, color, theme } = this.props
    const { value: percent } = this.state
    const timer = `${this.getTime() || 0}ms`
    const classList = ['mica-progress-bar'].concat(className || '')
    const style = this.lineStyle(percent, timer, color, theme)
    return (
      <div className={classList.join(' ')} ref={this.setRefs('root')}>
        <div className="bar-inner" style={style} />
        { this.props.children }
      </div>
    )
  }
}
