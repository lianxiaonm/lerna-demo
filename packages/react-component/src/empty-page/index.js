import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './style.less'

const { string, func, bool } = PropTypes

class EmptyPage extends PureComponent {
  static propTypes = {
    title: string,
    content: string.isRequired,
    icon: string,
    iconHeight: string,
    btn: string,
    btnClick: func,
    transparentTitle: bool,
  }

  static defaultProps = {
    transparentTitle: false,
    btnClick: () => {},
  }

  render() {
    const { icon, content, iconHeight, btn, btnClick, title, transparentTitle } = this.props
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
}

export default EmptyPage
