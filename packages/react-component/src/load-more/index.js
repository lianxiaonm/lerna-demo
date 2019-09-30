import React from 'react'
import PropTypes from 'prop-types'
import Lazy from '../lazy'
import './style.less'

const { func } = PropTypes

export default class LoadMore extends Lazy {
  static propTypes = { showMore: func }

  state = { loading: false, error: false }

  // 是否开始检测
  checkUpdate = () => {
    const { loading } = this.state
    const { root } = this.$refs
    return root && !loading && !this.unmount
  }

  inViewPort = () => {
    const { showMore } = this.props
    this.setState({ loading: true, error: false }, () => {
      Lazy.instances[this.index] = this
      new Promise(resolve => {
        showMore().then(() => resolve(false)).catch(() => resolve(true))
      }).then(error => {
        if (!this.unmount) {
          this.setState({ loading: false, error })
        }
      })
    })
  }

  render() {
    const { error } = this.state
    return (
      <div className="mica-load-more" ref={this.setRefs('root')}>
        {!error && <i />}
        {!error ? <span>正在加载中...</span> :
          <span onClick={this.inViewPort}>加载失败，点击重试</span> }
      </div>
    )
  }
}
