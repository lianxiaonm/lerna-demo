import React from 'react'
import PropTypes from 'prop-types'

import Circle from './extend/circle'
import BarLine from './extend/barLine'
import Numbers from './extend/number'

import './style.less'

const { string, number, oneOf, bool, node } = PropTypes

const Progress = (props) => {
  const { type, ...$props } = props
  if (type === 'bar') return <BarLine {...$props} />
  if (type === 'circle') return <Circle {...$props} />
  if (type === 'number') return <Numbers {...$props} />
  return null
}

Progress.propTypes = {
  type: oneOf(['circle', 'bar']),
  theme: oneOf(['blue', 'orange', 'emerald', 'custom']),
  value: number,
  total: number,
  color: string,
  realTime: bool,
  children: node,
}
Progress.BarLine = BarLine
Progress.Circle = Circle
Progress.Numbers = Numbers

export default Progress
