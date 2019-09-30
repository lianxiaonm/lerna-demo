import React from 'react'
import PropTypes from 'prop-types'

import './style.less'

const Icon = (props) => {
  const { type, className, ...prop } = props
  const clsList = ['icon-font'].concat(
    type ? `icon-${type}` : '',
  ).concat(className || '')
  return <i {...prop} className={clsList.join(' ')} />
}

Icon.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
}

export default Icon
