import React from 'react'
import Progress from '../progress'

const svgColor = {
  blue: '#09C3FF',
  orange: '#ff5900',
  emerald: '#86EB29',
}

export default class Circle extends Progress {
  static theme = Object.keys(svgColor)

  // 圆形进度条
  relativeStrokeWidth() { return 5.8 }

  trackPath() {
    const strokeWidth = this.relativeStrokeWidth() / 2
    const radius = parseInt(50 - strokeWidth, 10)
    return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`
  }

  perimeter() {
    const strokeWidth = this.relativeStrokeWidth() / 2
    return 2 * Math.PI * (50 - strokeWidth)
  }

  circlePathStyle(percent, time) {
    const { total } = this.props
    const perimeter = this.perimeter()
    return {
      strokeDasharray: `${perimeter}px,${perimeter}px`,
      strokeDashoffset: `${(1 - (percent / total)) * perimeter}px`,
      transition: `stroke-dashoffset ${time}, stroke ${time}`,
    }
  }

  render() {
    const { className, color, theme } = this.props
    const { value: percent } = this.state
    const timer = `${this.getTime() || 0}ms`
    const classList = ['mica-progress-circle'].concat(className || '')
    return (
      <div className={classList.join(' ')} ref={this.setRefs('root')}>
        <svg viewBox="0 0 100 100">
          <path d={this.trackPath()} stroke="#e5e9f2"
            strokeWidth={this.relativeStrokeWidth()} fill="none" />
          <path d={this.trackPath()} strokeLinecap="round"
            stroke={color || svgColor[theme] || '#20A0FF'}
            strokeWidth={this.relativeStrokeWidth()}
            fill="none" style={this.circlePathStyle(percent, timer)} />
        </svg>
        { this.props.children }
      </div>
    )
  }
}
