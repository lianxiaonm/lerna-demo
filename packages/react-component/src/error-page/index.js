import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './style.less'

const { string, oneOf, func, bool } = PropTypes

const config = {
  error: {
    title: '系统正忙，请稍候',
    subTitle: '稍等片刻，刷新试试带你飞',
    btn: '刷新',
  },
  'no-network': {
    title: '网络不给力',
    subTitle: '断网了，快快刷新',
    btn: '刷新',
  },
  'page-result-limiting': {
    title: '人气爆棚',
    subTitle: '稍等片刻，刷新试试有惊喜',
    btn: '刷新',
  },
}

class ErrorPage extends PureComponent {
  static propTypes = {
    type: oneOf(['error', 'no-network', 'page-result-limiting']),
    reload: func,
    title: string,
    subTitle: string,
    icon: string,
    iconHeight: string,
    btn: string,
    transparentTitle: bool,
  }

  static defaultProps = { type: 'error', transparentTitle: false }

  state = { loading: false }

  unmount = false

  customReload = () => {
    const { loading } = this.state
    if (!loading) {
      this.setState({ loading: true })
      const { reload } = this.props
      if (reload) {
        reload().then(
          () => !this.unmount && this.setState({ loading: false }),
          () => !this.unmount && this.setState({ loading: false }),
        )
      } else {
        window.location.reload()
      }
    }
  }

  componentWillUnmount() { this.unmount = true }

  render() {
    const { type, transparentTitle } = this.props
    const { loading } = this.state
    const props = { ...config[type], ...this.props }
    const { title, subTitle, icon, iconHeight, btn } = props
    const style = icon ? { backgroundImage: `url(${icon})`, height: iconHeight } : null

    return (
      <div className="mica-error-page" data-transparent={transparentTitle}>
        <i className="icon" style={style} data-type={type} />
        {title && <span className="title">{title}</span>}
        {subTitle && <span className="sub-title">{subTitle}</span>}
        {btn && (
          <span className="btn" data-loading={loading}
            onClick={this.customReload}>
            {loading ? '加载中...' : btn}
          </span>
        )}
      </div>
    )
  }
}

export default ErrorPage
