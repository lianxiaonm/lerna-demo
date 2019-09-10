import React from 'react'
import PropTypes from 'prop-types'
import RefsComponent from '../refs-component'
import { createSvgElement, spinners } from './svg'

import './style.less'

const { oneOf } = PropTypes

export default class Spinner extends RefsComponent {
  static propTypes = {
    type: oneOf([
      'ios',
      'ios-small',
      'bubbles',
      'circles',
      'crescent',
      'dots',
      'lines',
      'ripple',
      'spiral',
      'other',
    ]),
  }

  static defaultProps = { type: 'other' }

  componentDidMount() { this.paint() }

  paint = () => {
    const { type } = this.props
    const { $spin } = this.$refs
    const spinner = spinners[type] || ''
    if (spinner && $spin instanceof Element) {
      const container = document.createElement('div')
      createSvgElement('svg', {
        viewBox: '0 0 64 64', g: [spinner],
      }, container, type)
      $spin.innerHTML = container.innerHTML
    }
  }


  render() {
    const spinner = spinners[this.props.type] || ''
    return (
      <div className="mica-spinner" ref={this.setRefs('$spin')}>
        { !spinner ? (
          <svg className="svg-css" viewBox="25 25 50 50">
            <circle className="circle-css" cx="50" cy="50" r="20" fill="none" />
          </svg>
        ) : null }
      </div>
    )
  }
}
