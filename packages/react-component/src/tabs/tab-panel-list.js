import React from 'react'
import PropTypes from 'prop-types'
import PullElement from 'kobe-pull-element'
import { throttle, isInViewport, scrollBy } from '@mini-case/utils'
import RefsComponent from '../refs-component'
import ControlRender from './control-render'

const { number, string, bool, func, node, oneOf, oneOfType } = PropTypes

class TabPanelList extends RefsComponent {
  static propTypes = {
    className: string,
    sticky: bool,
    stickyTop: oneOfType([string, number]), // PX/rem
    children: node.isRequired,
    selectedIndex: number,
    milliseconds: number,
    tabPanelScroll: bool,
    type: oneOf(['split', 'anchor']),
    isUserScrollUpdate: bool,
    translateZ: bool,
    initScroll: bool,
    onSelect: func,
  }

  static defaultProps = {
    className: '',
  }

  state = { childrenUpdate: true }
  isUserScroll = true // 是否处于用户滚动状态

  // 页面滚动导致的更新
  checkViewport = throttle(() => {
    const { onSelect, selectedIndex } = this.props
    const { wrap } = this.$refs
    const tabPanels = [].slice.call(wrap.childNodes)
    const indexArr = []
    tabPanels.every((tabPanel, i) => {
      if (this.isPanelInViewport(tabPanel)) {
        // 点击 tab 导致滚动时，确保 viewList 以 selectedIndex 开头
        if (!this.isUserScroll && indexArr.length === 0 && i !== selectedIndex) return false
        indexArr.push(i)
        return true
      }
      return true
    })
    if (indexArr.length > 0) onSelect(indexArr[0], indexArr, true)
  }, this.props.milliseconds)

  // 记录用户触发滚动
  userScrollStart = () => { this.isUserScroll = true }

  handleStatusBarClick = () => { this.isUserScroll = true }

  // 滚动模式，滚动结束后更新子元素
  scrollCb = () => {
    const { milliseconds } = this.props
    if (milliseconds > 0) this.setState({ childrenUpdate: true })
  }

  // 切换模式，切换结束后更新子元素
  transitionCb = () => this.setState({ childrenUpdate: true })

  componentDidMount() {
    const { tabPanelScroll, translateZ, selectedIndex: index, initScroll } = this.props
    const { root, wrap } = this.$refs
    this.tabList = root.parentNode.childNodes[0]
    if (this.props.sticky) {
      this.tabList = this.tabList.querySelector('.mica-tab-list')
    }

    if (this.props.type === 'split') {
      if (tabPanelScroll) {
        const component = this
        this.pullElement = new PullElement({
          target: wrap,
          wait: false,
          translateZ,
          onPullLeft() { this.preventDefault() },
          onPullRight() { this.preventDefault() },
          onPullLeftEnd() {
            this.preventDefault()
            const { selectedIndex, children, onSelect } = component.props
            if (selectedIndex + 1 < React.Children.count(children)) onSelect(selectedIndex + 1)
          },
          onPullRightEnd() {
            this.preventDefault()
            const { selectedIndex, onSelect } = component.props
            if (selectedIndex - 1 >= 0) onSelect(selectedIndex - 1)
          },
        })
        this.pullElement.init()
      }
      // 分屏模式时，tab-panel 切换动画结束时执行 children DOM diff
      wrap.addEventListener('transitionend', this.transitionCb, false)
    } else {
      // 锚点模式时，滚动结束后检查是否需要切换 tab
      document.addEventListener('scroll', this.checkViewport, false)
      // 记录用户触发滚动
      wrap.addEventListener('touchstart', this.userScrollStart, false)
      document.addEventListener('statusBarClick', this.handleStatusBarClick, false)
      if (initScroll) this.scrollTabPanel(index)
      else this.checkViewport()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedIndex: nextIndex, milliseconds, isUserScrollUpdate } = nextProps
    const { selectedIndex: index } = this.props

    // 非用户滚动导致切换时，延迟执行 children DOM diff
    if (nextIndex !== index && !isUserScrollUpdate && milliseconds > 0) {
      this.setState({ childrenUpdate: false })
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedIndex: prevIndex } = prevProps
    const { selectedIndex: index, type, isUserScrollUpdate } = this.props
    if (prevIndex !== index) {
      // 锚点模式，非用户滚动时，执行 tabpanel 滚动
      if (type !== 'split' && !isUserScrollUpdate) this.scrollTabPanel(index)
    }
  }

  componentWillUnMount() {
    const { wrap } = this.$refs
    if (this.pullElement) this.pullElement.destroy()
    if (this.props.type === 'split') {
      wrap.removeEventListener('transitionend', this.transitionCb, false)
    } else {
      document.removeEventListener('scroll', this.checkViewport, false)
      wrap.removeEventListener('touchstart', this.userScrollStart, false)
      document.removeEventListener('statusBarClick', this.handleStatusBarClick, false)
    }
  }

  // 判断 panel 是否在视区
  isPanelInViewport(tabPanel) {
    const { bottom: tabBottom } = this.tabList.getBoundingClientRect()
    const { bottom: tabPanelBottom } = tabPanel.getBoundingClientRect()
    return isInViewport(tabPanel) && tabPanelBottom > tabBottom + 1
  }

  // 获取 dom 元素距离页面顶部高度
  getTop(dom) {
    if (!dom) return 0
    const { offsetTop, offsetParent } = dom
    return offsetTop + this.getTop(offsetParent)
  }

  // tabPanel 滚动置顶
  scrollTabPanel(index) {
    const { stickyTop, milliseconds } = this.props
    const { wrap } = this.$refs

    // 非用户滚动
    this.isUserScroll = false
    const activePanel = wrap.childNodes[index]
    const { offsetHeight: tabListHeight } = this.tabList
    const scrollY = window.scrollY
    // 滚动距离：当前 panel 距离顶部高度 - tabbar 高度 - sticky 距离 - 页面滚动距离
    const distance = this.getTop(activePanel) - tabListHeight - stickyTop - scrollY
    // 解决wk下，滚动超过页面最大可滚动距离
    const maxDistance = window.document.body.scrollHeight - scrollY - window.innerHeight
    const toScrollY = distance > maxDistance ? maxDistance : distance
    // 执行 tabpanel 滚动, 滚动结束时执行 children DOM diff
    scrollBy(window, 0, toScrollY, milliseconds, this.scrollCb)
  }

  render() {
    const { className, children, selectedIndex, milliseconds, type, translateZ } = this.props
    const { childrenUpdate } = this.state
    const panelList = React.Children.map(children, (child, i) => (
      <div key={i} className="tab-panel" data-active={selectedIndex === i}>
        <ControlRender isUpdate={childrenUpdate}>{child}</ControlRender>
      </div>
    ))
    const transform = translateZ ? `translate3d(-${selectedIndex * 100}%, 0, 0)` :
      `translate(-${selectedIndex * 100}%, 0)`
    const style = type === 'split' ? {
      transform,
      WebkitTransform: transform,
      transitionDuration: `${milliseconds}ms`,
    } : null
    return (
      <div ref={this.setRefs('root')} data-type={type}
        className={`mica-tab-panel-list ${className}`}>
        <div ref={this.setRefs('wrap')} className="wrap" style={style}>
          {panelList}
        </div>
      </div>
    )
  }
}

export default TabPanelList
