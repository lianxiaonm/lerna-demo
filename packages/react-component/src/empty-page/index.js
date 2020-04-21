import React from 'react'
import PropTypes from 'prop-types'
import './style.less'

const { string, func, bool } = PropTypes

const EmptyPage = ({
  icon, content, iconHeight, title, btn,
  btnClick = () => false,
  transparentTitle = false,
}) => {
  const style = icon ? { backgroundImage: `url(${icon})`, height: iconHeight } : null
  return (
    <div className="mica-empty-page" data-transparent={transparentTitle}>
      <i style={style} />
      {title && <span className="title">{title}</span>}
      <span className="content">{content}</span>
      {btn && <span className="btn" onClick={btnClick}>{btn}</span>}
    </div>
  )
}
EmptyPage.propTypes = {
  title: string,
  content: string.isRequired,
  icon: string,
  iconHeight: string,
  btn: string,
  btnClick: func,
  transparentTitle: bool,
}

export default React.memo(EmptyPage)
