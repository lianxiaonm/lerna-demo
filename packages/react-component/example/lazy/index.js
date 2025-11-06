import React, { PureComponent } from 'react'
import { Lazy } from '@mini-case/react-component'

const { clientHeight } = document.documentElement

class LazyOne extends Lazy {
  state = { text: '模块初始化' }

  inViewPort = () => {
    console.log('进入界面。加载数据....')
    setTimeout(() => {
      this.setState({
        text: '模块内容加载完成...',
      })
    }, 500)
  }

  render() {
    const { text } = this.state
    const style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: `${clientHeight}px`,
    }
    return (
      <div style={style} ref={this.setRefs('root')}>{text}</div>
    )
  }
}


class LazyExample extends PureComponent {
  render() {
    return (
      <div className="lazy-example">
        <LazyOne />
        <LazyOne />
        <LazyOne />
        <LazyOne />
      </div>
    )
  }
}

export default <LazyExample />
