import React from 'react'
import PropTypes from 'prop-types'
import { scrollBy } from '@mini-case/utils'
import RefsComponent from '../refs-component'
import ControlRender from './control-render'
import XScroll from '../x-scroll'

const { number, string, bool, func, node } = PropTypes

class TabList extends RefsComponent {
  static propTypes = {
    className: string,
    children: node.isRequired,
    selectedIndex: number,
    onSelect: func,
    milliseconds: number,
    tabScroll: bool,
    activeTabOrder: number,
  }

  static defaultProps = {
    className: '',
  }

  state = { childrenUpdate: true }

  // tab 切换
  tabSelect = i => () => { this.props.onSelect(i) }

  // 滚动模式，滚动结束后更新子元素
  scrollCb = () => {
    if (this.props.milliseconds > 0) {
      this.setState({ childrenUpdate: true })
    }
  }

  // 切换模式，切换结束后更新子元素
  transitionCb = () => this.setState({ childrenUpdate: true })

  componentDidMount() {
    const { selectedIndex } = this.props
    const { cursorWrap } = this.$refs
    if (this.props.tabScroll) {
      // 滚动模式时，初始化 tab 滚动
      this.scrollTab(selectedIndex)
    } else {
      // 切换模式，切换结束后更新子元素
      cursorWrap.addEventListener('transitionend', this.transitionCb, false)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedIndex: nextIndex } = nextProps
    const { selectedIndex: index, milliseconds } = this.props

    // tab 切换时延迟执行 children DOM diff
    if (nextIndex !== index && milliseconds > 0) this.setState({ childrenUpdate: false })
  }

  componentDidUpdate(prevProps) {
    const { selectedIndex: prevIndex } = prevProps
    const { selectedIndex: index, tabScroll } = this.props
    // 滚动模式时，执行滚动
    if (tabScroll && prevIndex !== index) this.scrollTab(index)
  }

  componentWillUnmount() {
    const { cursorWrap } = this.$refs
    if (!this.props.tabScroll) {
      cursorWrap.removeEventListener('transitionend', this.transitionCb, false)
    }
  }

  scrollTab(i) {
    const { activeTabOrder, milliseconds } = this.props
    const { root } = this.$refs
    const leftIndex = Math.max((i - activeTabOrder) + 1, 0)
    const container = root.childNodes[0].childNodes[0]
    const leftTab = container.childNodes[leftIndex]
    const { left } = leftTab.getBoundingClientRect()
    const { left: rootLeft } = root.getBoundingClientRect()
    const distance = -(rootLeft - left)
    // 滚动模式时，执行滚动，滚动结束时执行 children DOM diff
    scrollBy(container, distance, 0, milliseconds, this.scrollCb)
  }

  render() {
    const { className, children, selectedIndex, tabScroll, milliseconds } = this.props
    const { childrenUpdate } = this.state
    const list = React.Children.map(children, (child, i) => (
      <li key={i} className="tab"
        data-selected={i === selectedIndex}
        onClick={this.tabSelect(i)}>
        <ControlRender isUpdate={childrenUpdate}>{child}</ControlRender>
      </li>
    ))
    const count = React.Children.count(children)
    const style = {
      left: `${(1 / count) * selectedIndex * 100}%`,
      width: `${(1 / count) * 100}%`,
      transitionDuration: `${milliseconds}ms`,
    }
    return (
      <ul className={`mica-tab-list ${className}`} ref={this.setRefs('root')}>
        {tabScroll ? <XScroll>{list}</XScroll> : list }
        {!tabScroll && (
          <div className="cursor-wrap" ref={this.setRefs('cursorWrap')} style={style}>
            <span className="cursor" />
          </div>
        )}
      </ul>
    )
  }
}

export default TabList
