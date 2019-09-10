/* eslint-disable no-param-reassign */

import React, { cloneElement } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { rem2PX, checkType } from '@mini-case/utils'
import RefsComponent from '../refs-component'
import TabList from './tab-list'
import TabPanelList from './tab-panel-list'
import Sticky from '../sticky'
import './style.less'

const { isString } = checkType

const { bool, string, number, func, node, oneOf, oneOfType } = PropTypes
const filterValidReactElement = children => (
  React.Children.toArray(children).filter(child => child !== null && child !== false)
)

class Tabs extends RefsComponent {
  static propTypes = {
    type: oneOf(['split', 'anchor']),
    selectedIndex: number.isRequired,
    onSelect: func.isRequired,
    duration: oneOfType([string, number]),
    panelDuration: oneOfType([string, number]),
    simulateSticky: bool,
    sticky: bool,
    stickyTop: oneOfType([string, number]), // PX/rem
    tabScroll: bool,
    tabPanelScroll: bool,
    activeTabOrder: number,
    translateZ: bool,
    className: string,
    initScroll: bool,
    children: node.isRequired,
  }

  static defaultProps = {
    type: 'split',
    duration: '0.2s',
    simulateSticky: false,
    sticky: true,
    stickyTop: 0,
    tabScroll: false,
    tabPanelScroll: false,
    activeTabOrder: 2,
    translateZ: true,
    initScroll: false,
    className: '',
  }

  constructor(props) {
    super(props)
    if (React.Children.count(props.children) < 2) {
      throw new Error('tabs needs tab-list and tab-panel-list children')
    }
    this.scrollYs = [] // 记录每个 tab-panel 的滚动距离
    this.isUserScrollUpdate = false // 是否是用户滚动更新

    const { stickyTop } = props
    this.state = { stickyTop: this.getStickyTop(stickyTop) }
  }


  tabSelect = (index, indexArr = [index], isUserScrollUpdate = false) => {
    const { onSelect } = this.props
    this.isUserScrollUpdate = isUserScrollUpdate
    onSelect(index, indexArr)
  }

  hideOtherPanel = () => {
    const tabPanels = [].slice.call(this.tabPanelWrap.childNodes)
    tabPanels.forEach(tabPanel => {
      if (tabPanel.getAttribute('data-active') !== 'true') {
        tabPanel.style.height = 0
        ;[].slice.call(tabPanel.childNodes)
          .forEach(child => { child.style.display = 'none' })
      }
    })
    // 显示 append
    this.$refs.append.style.opacity = ''
  }

  componentDidMount() {
    const { selectedIndex, sticky, type } = this.props
    const { tabList, tabPanelList } = this.$refs
    this.tabPanelWrap = ReactDOM.findDOMNode(tabPanelList).childNodes[0]

    if (type === 'split') {
      if (sticky) {
        // sticky 模式下，记录每个 tab-panel 的滚动高度
        // preact: tabList.children
        // react: tabList.props.children
        const { scrollY } = window
        const listChildren = tabList.children || tabList.props.children
        React.Children.forEach(listChildren, (tab, i) => {
          this.scrollYs[i] = selectedIndex === i ? scrollY : 0
        })
      }

      // 隐藏非激活 tab-panel，显示 append
      this.hideOtherPanel()

      // tab-panel 切换结束时： 隐藏非激活 tab-panel，显示 append
      this.tabPanelWrap.addEventListener('transitionend', this.hideOtherPanel, false)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedIndex: nextIndex } = nextProps
    const { selectedIndex: index, type } = this.props

    if (nextIndex !== index) {
      if (type === 'split') {
        // 切换 tab 时： 重置即将激活的 tab-panel 高度，隐藏 append
        const activeTabPanel = this.tabPanelWrap.childNodes[nextIndex]
        activeTabPanel.style.height = ''
        ;[].slice.call(activeTabPanel.childNodes)
          .forEach(child => { child.style.display = '' })
        this.$refs.append.style.opacity = 0
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedIndex: prevIndex } = prevProps
    const { selectedIndex: index, sticky, type, duration, panelDuration = duration } = this.props
    const { stickyTop } = this.state

    if (prevIndex !== index) {
      if (type === 'split') {
        if (sticky) {
          // 记录当前滚动位置
          this.scrollYs[prevIndex] = window.scrollY

          // 恢复上次滚动位置，保持最小 sticky 状态
          const stickyScrollY = this.getStickyScrollY(stickyTop)
          if (this.$refs.sticky.isSticky()) {
            const distance = Math.max(this.scrollYs[index], stickyScrollY)
            requestAnimationFrame(() => window.scrollTo(0, distance))
          }
        }

        // tabPanel 无动画时手动执行： 隐藏非激活 tab-panel，显示 append
        const milliseconds = this.getMilliseconds(panelDuration)
        if (milliseconds === 0) this.hideOtherPanel()
      }
    }
  }

  componentWillUnmount() {
    const { type } = this.props
    if (type === 'split') {
      this.tabPanelWrap.removeEventListener('transitionend', this.hideOtherPanel, false)
    }
  }

  getStickyScrollY(stickyTop) {
    const { root } = this.$refs
    const { top: rootTop } = root.getBoundingClientRect()
    const scrollY = window.scrollY
    return (scrollY + rootTop) - stickyTop
  }

  getStickyTop(stickyTop) {
    let topPX = parseFloat(stickyTop)
    if (/rem$/.test(stickyTop)) topPX = rem2PX(topPX)
    return topPX
  }

  getMilliseconds(duration) {
    let milliseconds = parseFloat(duration)
    if (isString(duration) && !/ms$/.test(duration)) milliseconds *= 1000
    return milliseconds
  }

  render() {
    const { children, selectedIndex, duration, panelDuration = duration, sticky,
      tabScroll, tabPanelScroll, activeTabOrder, type, translateZ, className,
      simulateSticky, initScroll } = this.props
    const { stickyTop } = this.state
    const [tabList, tabPanelList, appendChild] = React.Children.toArray(children)
    const milliseconds = this.getMilliseconds(duration)
    const panelMilliseconds = this.getMilliseconds(panelDuration)
    let tabListElement = cloneElement(tabList, {
      selectedIndex,
      milliseconds,
      tabScroll,
      activeTabOrder,
      ref: this.setRefs('tabList'),
      onSelect: this.tabSelect,
      children: filterValidReactElement(tabList.props.children),
    })
    const tabPanelListElement = cloneElement(tabPanelList, {
      type,
      sticky,
      stickyTop,
      selectedIndex,
      milliseconds: panelMilliseconds,
      tabPanelScroll,
      isUserScrollUpdate: this.isUserScrollUpdate,
      translateZ,
      initScroll,
      ref: this.setRefs('tabPanelList'),
      onSelect: this.tabSelect,
      children: filterValidReactElement(tabPanelList.props.children),
    })

    if (sticky) {
      tabListElement = (
        <Sticky ref={this.setRefs('sticky')} top={stickyTop}
          simulate={simulateSticky}>{tabListElement}
        </Sticky>
      )
    }
    return (
      <div ref={this.setRefs('root')} className={`mica-tabs ${className}`}>
        {tabListElement}
        {tabPanelListElement}
        <div ref={this.setRefs('append')}>{appendChild}</div>
      </div>
    )
  }
}

Tabs.TabList = TabList
Tabs.TabPanelList = TabPanelList
export default Tabs
