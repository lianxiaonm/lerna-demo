import React from 'react'
import PropTypes from 'prop-types'
import PullElement from 'kobe-pull-element'
import { throttle } from '@mini-case/utils'
import RefsComponent from '../refs-component'
import Lazy from '../lazy'
import './style.less'

const { node, bool, number, string, func, oneOf } = PropTypes

const { floor } = Math
const toFixed = value => floor(value * 100) / 100
const isClient = typeof window !== 'undefined'

class Slider extends RefsComponent {
  static propTypes = {
    children: node.isRequired,
    gap: string,
    loop: bool,
    autoplay: number,
    initialSlide: number,
    slidesPerView: number,
    slidesPerGroup: number,
    direction: oneOf(['horizontal', 'vertical']),
    pagination: bool,
    translateZ: bool,
    onSlide: func,
  }

  static defaultProps = {
    gap: '0px',
    autoplay: 0,
    loop: false,
    initialSlide: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    direction: 'horizontal',
    pagination: true,
    translateZ: true,
    onSlide: () => false,
  }

  constructor(props) {
    super(props)
    const { initialSlide, children, loop, autoplay } = props
    if (autoplay && !loop) throw new Error('autoplay must be loop')
    this.$refs = {}
    this.timer = -1
    this.pulling = false
    this.unmount = false
    this.count = React.Children.count(children)
    this.state = { activeIndex: initialSlide }
  }

  componentDidMount() {
    this.initPullElement()
    this.eventConvert(true)
  }

  componentDidUpdate(prevProps) {
    const { count } = this
    const { children, slidesPerView } = this.props
    this.count = React.Children.count(children)
    if (count !== this.count) {
      if (this.pullElement) this.pullElement.destroy()
      this.initPullElement()
    } else if (slidesPerView !== prevProps.slidesPerView) {
      this.onResize()
    }
  }

  componentWillUnmount() {
    this.pause()
    this.eventConvert()
    this.unmount = true
    if (this.pullElement) this.pullElement.destroy()
  }

  getPadOffset() {
    const { slidesPerView } = this.props
    const gapPX = this.getGapPx()
    const isHorizontal = this.isHorizontal()
    const { clientWidth, clientHeight } = this.$refs.target || { clientWidth: 0, clientHeight: 0 }
    const marginPX = (slidesPerView - 1) * gapPX
    return {
      height: !isHorizontal ? toFixed((clientHeight - marginPX) / slidesPerView) : 0,
      width: isHorizontal ? toFixed((clientWidth - marginPX) / slidesPerView) : 0,
    }
  }

  eventConvert(isAdd) {
    const { target } = this.$refs
    const eventStr = isAdd ? 'addEventListener' : 'removeEventListener'
    window[eventStr]('resize', this.onResize, true)
    if (eventStr in target) {
      const { parentNode: parent } = target
      parent[eventStr]('mouseenter', this.onMouse, true)
      parent[eventStr]('mouseleave', this.onMouse, true)
    }
  }

  onMouse = evt => {
    const { autoplay } = this.props
    const { type, currentTarget, target } = evt
    if (currentTarget === target && autoplay) {
      if (type === 'mouseenter') this.pause()
      else this.autoplay()
    }
  }

  onResize = throttle(() => {
    if (this.unmount) return
    // const gapPX = this.getGapPx()
    // const { height, width } = this.getPadOffset()
    // const isHorizontal = this.isHorizontal()
    //
    // const { childNodes } = this.$refs.target || { childNodes: [] };
    // [].slice.call(childNodes).forEach(child => {
    //  if (isHorizontal) {
    //    child.style.marginRight = `${gapPX}px`
    //    child.style.width = `${width}px`
    //  } else {
    //    child.style.marginBottom = `${gapPX}px`
    //    child.style.height = `${height}px`
    //  }
    // })
    this.switchSlide(this.state.activeIndex, false)
  }, 100 / 6)

  initPullElement() {
    const component = this
    const {
      props: { autoplay },
      state: { activeIndex: initIndex },
    } = this
    const isHorizontal = this.isHorizontal()

    function pull() {
      component.pulling = true
      component.pause()
    }

    function handlePullEnd({ translateX, translateY }) {
      this.preventDefault()
      const { activeIndex } = component.state
      const {
        translateX: prevTranslateX,
        translateY: prevTranslateY,
      } = component.calculateDistance({
        translateIndex: component.getTranslateIndex(activeIndex),
      })
      const diff = isHorizontal
        ? translateX - prevTranslateX
        : translateY - prevTranslateY

      if (diff > 20) component.switchPrev(true)
      else if (diff < -20) component.switchNext(true)
      else component.switchSlide(activeIndex, true)

      // 滑动结束开启自动播放
      component.pulling = false
      if (autoplay) component.autoplay()
    }

    const side = isHorizontal ? 'Left' : 'Up'
    const side2 = isHorizontal ? 'Right' : 'Down'
    this.pullElement = new PullElement({
      wait: false,
      target: this.$refs.target,
      transitionProperty: 'transform',
      [`onPull${side}`]: pull,
      [`onPull${side2}`]: pull,
      [`onPull${side}End`]: handlePullEnd,
      [`onPull${side2}End`]: handlePullEnd,
      translateZ: this.props.translateZ,
    })
    this.pullElement.init()

    this.switchSlide(initIndex, false)

    // 挂载结束，开启自动播放
    if (autoplay) this.autoplay()
  }

  autoplay() {
    const { autoplay } = this.props
    if (!this.pulling && this.timer === -1) {
      this.timer = setTimeout(() => {
        if (!this.unmount) {
          this.switchNext(true)
          this.timer = -1
          this.autoplay()
        }
      }, autoplay)
    }
  }

  pause = () => {
    if (this.timer !== -1) {
      clearTimeout(this.timer)
      this.timer = -1
    }
  }

  getTranslateIndex = (index) => {
    const isLoop = this.getLoop()
    const { slidesPerGroup } = this.props
    return isLoop ? index + slidesPerGroup : index
  }

  // 计算偏移量
  indexGetter = index => {
    const {
      count,
      props: { slidesPerGroup, slidesPerView },
    } = this
    const isLoop = this.getLoop()
    const floorPreView = floor(slidesPerView)
    const endBoundary = Math.max(1, count - floorPreView)
    let current = index
    let activeIndex = index

    // 下标起点修复 1->2   2->3
    if (current > 0 && slidesPerGroup > 1) current += 1

    if (!isLoop) { // 非循环模式
      if (current < 0) current = 0
      else if (current > endBoundary) {
        current = endBoundary // 超出边界 反弹回边界
      }
      activeIndex = current
    } else { // 循环模式
      // eslint-disable-next-line no-lonely-if
      if (current < 0) {
        activeIndex = (current % count) + count
      } else if (current > endBoundary) {
        activeIndex = current % count // 超出边界，进入自循环起始位
      }
    }
    return {
      current: floor(current / slidesPerGroup) * slidesPerGroup,
      activeIndex: floor(activeIndex / slidesPerGroup) * slidesPerGroup,
    }
  }

  switchPrev = ani => {
    const { slidesPerGroup } = this.props
    const { activeIndex } = this.state
    this.switchSlide(activeIndex - slidesPerGroup, ani)
  }

  switchNext = ani => {
    const { slidesPerGroup } = this.props
    const { activeIndex } = this.state
    this.switchSlide(activeIndex + slidesPerGroup, ani)
  }

  switchSlide =(index, animation) => {
    const { onSlide } = this.props
    const { current, activeIndex } = this.indexGetter(index)
    const { translateX, translateY } = this.calculateDistance({
      translateIndex: this.getTranslateIndex(current),
    })

    const animateTo = () => {
      if (this.unmount || !this.pullElement) return
      this.setState({ activeIndex })
      this.pullElement.animateTo(translateX, translateY).then(() => {
        onSlide(activeIndex)
        if (current !== activeIndex) this.switchSlide(activeIndex, false)
      })
    }

    if (animation || [null, undefined].indexOf(animation) > -1) animateTo()
    else {
      this.pullElement.setTranslate(translateX, translateY)
      Lazy.checkViewport()
      setTimeout(() => animateTo(), 100)
    }
  }

  calculateDistance = config => {
    const { translateIndex } = config
    const gapPX = this.pxGetter(this.props.gap)
    const isHorizontal = this.isHorizontal()
    const { width, height } = this.getPadOffset()
    const translateXValue = toFixed((+width + gapPX) * translateIndex)
    const translateYValue = toFixed((+height + gapPX) * translateIndex)
    const translateX = isHorizontal ? -translateXValue : 0
    const translateY = !isHorizontal ? -translateYValue : 0
    return { translateX, translateY }
  }

  render() {
    const {
      slidesPerView, slidesPerGroup: copyCount, //
      children, pagination, direction, customPagination,
    } = this.props
    const { count, state: { activeIndex } } = this
    const children2 = React.Children.toArray(children)
    const isLoop = this.getLoop()

    if (isLoop) {
      // 循环模式前后插入两个元素
      const firstChild = children2.slice(0, copyCount)
      const lastChild = children2.slice(-copyCount)
      children2.push(...firstChild)
      children2.unshift(...lastChild)
    }

    const gapPX = this.getGapPx()
    const isHorizontal = this.isHorizontal()
    const marginPx = toFixed(((slidesPerView - 1) * gapPX) / slidesPerView)

    // slideList
    const slideList = children2.map((child, i) => {
      let active = activeIndex === i
      if (isLoop) {
        if (activeIndex === 0) {
          active = i === copyCount || i === count + copyCount
        } else if (activeIndex === count - 1) {
          active = i === count + (copyCount - 1) || i === copyCount - 1
        } else {
          active = activeIndex === i - copyCount
        }
      }
      const styles = { width: `calc(${toFixed(100 / slidesPerView)}% - ${marginPx}px)` }
      styles[isHorizontal ? 'marginRight' : 'marginBottom'] = `${gapPX}px`
      return <div key={i} data-active={active} className="slide" style={styles} children={child} />
    })
    // pagination
    let paginationNode
    if (typeof customPagination === 'function') {
      paginationNode = customPagination({
        total: React.Children.count(children),
        currentIndex: activeIndex,
        onClick: index => this.switchSlide(index, true),
      })
    } else {
      const bullets = React.Children.map(children, (child, i) => (
        <span className="bullet" key={i} data-active={activeIndex === i} />
      ))
      paginationNode = pagination && <div className="pagination">{bullets}</div>
    }

    return (
      <div className="mica-slider" data-direction={direction}>
        <div className="slide-wrapper" ref={this.setRefs('target')}>{slideList}</div>
        {paginationNode}
      </div>
    )
  }

  getLoop() {
    const { loop, slidesPerGroup } = this.props
    return isClient && loop && this.count > slidesPerGroup
  }

  // helpers
  isHorizontal() {
    return this.props.direction === 'horizontal'
  }

  getGapPx() {
    return parseFloat(this.props.gap)
  }

  // '20px' -> 20
  pxGetter(raw) {
    return parseFloat(raw)
  }
}

export default Slider
