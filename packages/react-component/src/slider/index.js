import React from 'react'
import PropTypes from 'prop-types'
import PullElement from 'kobe-pull-element'
import { rem2PX, checkType, NO_OP } from '@mini-case/utils'
import RefsComponent from '../refs-component'
import Lazy from '../lazy'
import './style.less'

const { node, bool, number, string, func, array, oneOf } = PropTypes

class Slider extends RefsComponent {
  static propTypes = {
    children: node.isRequired,
    initialSlide: number,
    direction: oneOf(['horizontal', 'vertical']),
    autoplay: number,
    loop: bool,
    copyCount: number,
    pagination: bool,
    gap: string, // 目前支持 rem/PX
    lookAhead: string,
    lookBehind: string,
    translateZ: bool,
    onSlide: func,
    customPagination: func,
    autoHeight: bool,
    heightMap: array,
  }

  static defaultProps = {
    initialSlide: 0,
    direction: 'horizontal',
    autoplay: 0,
    loop: false,
    copyCount: 1,
    pagination: true,
    gap: '0px',
    lookAhead: '0px',
    lookBehind: '0px',
    translateZ: true,
    autoHeight: false,
    heightMap: [],
    onSlide: NO_OP,
  }

  constructor(props) {
    super(props)
    const { initialSlide, children, loop, copyCount, autoplay, autoHeight, heightMap } = props
    if (autoplay && !loop) throw new Error('autoplay must be loop')
    if (loop && copyCount <= 0) throw new Error('loop copy count must be > 0')
    this.timer = -1
    this.pulling = false
    this.unmount = false
    this.count = React.Children.count(children)
    this.state = { activeIndex: initialSlide }

    this.canAutoHeight = false
    if (autoHeight) {
      this.canAutoHeight = true
      if (!this.isHorizontal()) {
        console.error('mica-component Slider: autoHeight needs props `direction` to be `horizontal`.')
        this.canAutoHeight = false
      }
      if (!heightMap || heightMap.length === 0) {
        console.error('mica-component Slider: autoHeight needs heightMap for each slide.')
        this.canAutoHeight = false
      }
    }
  }

  componentDidMount() {
    this.initPullElement()
  }

  componentDidUpdate() {
    const count = this.count
    this.count = React.Children.count(this.props.children)
    // 当页数在1附近跳变时候，要重新计算
    if (
      count !== this.count &&
      (count - 2) * (this.count - 2) <= 0
    ) {
      this.initPullElement()
    }
  }

  componentWillUnmount() {
    if (this.pullElement) this.pullElement.destroy()
    this.unmount = true
  }

  initPullElement() {
    const { slider } = this.$refs
    if (this.count < 2) {
      if (this.canAutoHeight) {
        slider.style.height = `${this.props.heightMap[0]}px`
      }
      return
    }

    const component = this
    const { autoplay, initialSlide, gap, translateZ, heightMap } = this.props
    const gapPX = this.pxGetter(gap)
    const { target } = this.$refs
    const clientWidth = target.clientWidth + gapPX
    const clientHeight = target.clientHeight + gapPX
    const isHorizontal = this.isHorizontal()
    const canAutoHeight = this.canAutoHeight

    function handlePullEnd({ translateX, translateY }) {
      this.preventDefault()
      let { activeIndex } = component.state
      let diff = 0
      const index = component.indexGetter(activeIndex)
      if (isHorizontal) {
        const prevTranslateX = -clientWidth * index
        diff = translateX - prevTranslateX
      } else {
        const prevTranslateY = -clientHeight * index
        diff = translateY - prevTranslateY
      }
      const base = 20
      if (diff > base) {
        activeIndex -= 1
      } else if (diff < -base) {
        activeIndex += 1
      }
      component.switchSlide(activeIndex)

      // 滑动结束开启自动播放
      component.pulling = false
      if (autoplay) component.autoplay()
    }

    function pull(data, isForward) {
      // 滑动过程中，暂停自动播放
      component.pulling = true
      if (component.timer !== -1) {
        clearTimeout(component.timer)
        component.timer = -1
      }

      if (canAutoHeight) {
        const { activeIndex } = component.state
        const nextIndex = activeIndex + (isForward ? 1 : -1)
        const currentHeight = heightMap[activeIndex]
        const nextHeight = heightMap[nextIndex]
        const coveredPercentage = -(data.translateX % clientWidth) / clientWidth // 已经走过的占总共的比例
        const increment = (nextHeight - currentHeight) * (
          isForward ? coveredPercentage : (1 - coveredPercentage)
        )
        target.style.height = `${currentHeight + increment}px`
      }
    }

    const side = isHorizontal ? 'Left' : 'Up'
    const side2 = isHorizontal ? 'Right' : 'Down'
    this.pullElement = new PullElement({
      transitionProperty: canAutoHeight ? 'transform, height' : 'transform',
      target,
      wait: false,
      [`onPull${side}`]: data => {
        pull(data, true)
      },
      [`onPull${side2}`]: data => {
        pull(data)
      },
      [`onPull${side}End`]: handlePullEnd,
      [`onPull${side2}End`]: handlePullEnd,
      translateZ,
    })
    this.pullElement.init()

    this.switchSlide(initialSlide, false)
    if (canAutoHeight) {
      // 强制把父元素的高度调整成自动，启动过渡效果
      target.parentNode.style.height = 'auto'
      target.style.height = `${heightMap[0]}px`
    }

    // 挂载结束，开启自动播放
    if (autoplay) this.autoplay()
  }

  autoplay() {
    const { autoplay } = this.props
    if (!this.pulling && this.timer === -1) {
      this.timer = setTimeout(() => {
        if (!this.unmount) {
          const { activeIndex } = this.state
          this.switchSlide(activeIndex + 1)
          this.timer = -1
          this.autoplay()
        }
      }, autoplay)
    }
  }

  // 计算偏移量
  indexGetter = (index) => {
    const { loop, children } = this.props
    const count = React.Children.count(children)
    let { copyCount } = this.props
    copyCount = copyCount > count ? count : copyCount
    return loop ? index + copyCount : index
  }

  switchSlide(index, animation) {
    const { loop, onSlide, heightMap } = this.props
    const count = this.count

    let animateIndex = index
    let activeIndex = index
    if (!loop) {
      if (animateIndex >= count) {
        animateIndex = count - 1
      } else if (animateIndex < 0) {
        animateIndex = 0
      }
      activeIndex = animateIndex
    } else if (animateIndex >= count) {
      activeIndex = animateIndex % count
    } else if (animateIndex < 0) {
      activeIndex = (animateIndex % count) + count
    }

    // 循环模式下，跳过第一张占位图
    const translateIndex = this.indexGetter(animateIndex)

    const { translateX, translateY } = this.calculateDistance({ translateIndex })

    if (animation || checkType.isNull(animation)) {
      this.setState({ activeIndex })
      const { target } = this.$refs
      if (this.canAutoHeight && target) {
        target.style.height = `${heightMap[activeIndex]}px`
      }
      this.pullElement.animateTo(translateX, translateY).then(() => {
        onSlide(activeIndex)
        if (animateIndex !== activeIndex) this.switchSlide(activeIndex, false)
      })
    } else {
      this.pullElement.setTranslate(translateX, translateY)
      Lazy.checkViewport()
      setTimeout(() => this.pullElement.animateTo(translateX, translateY), 100)
    }
  }

  calculateDistance = (config) => {
    const { translateIndex } = config
    // 当不循环，且padding-left为零的时候，从倒数第二个滑到倒数第一个，需要特殊处理
    // Caution: 这里默认第一屏是第一页
    const { gap } = this.props
    const { target } = this.$refs
    const { clientWidth, clientHeight } = target
    const isHorizontal = this.isHorizontal()
    const gapPX = this.pxGetter(gap)

    const translateXValue = (clientWidth + gapPX) * translateIndex
    const translateYValue = (clientHeight + gapPX) * translateIndex
    const translateX = isHorizontal ? -translateXValue : 0
    const translateY = !isHorizontal ? -translateYValue : 0

    return { translateX, translateY }
  }

  render() {
    const { children, pagination, gap, direction, loop,
      customPagination, lookAhead, lookBehind } = this.props
    let { copyCount } = this.props
    const isHorizontal = this.isHorizontal()
    const count = React.Children.count(children)
    if (count < 2) return <div className="mica-slider" ref={this.setRefs('slider')}>{children}</div>

    const lookAheadPX = this.pxGetter(lookAhead)
    const lookBehindPX = this.pxGetter(lookBehind)
    const gapPX = this.pxGetter(gap)
    const { activeIndex } = this.state
    const children2 = React.Children.toArray(children)
    const wrapperStyle = {}

    if (loop) {
      copyCount = count > copyCount ? copyCount : count
      // 循环模式前后插入两个元素
      const firstChild = children2.slice(0, copyCount)
      const lastChild = children2.slice(-copyCount)
      children2.push(...firstChild)
      children2.unshift(...lastChild)
    }

    // 设置 slide gap
    wrapperStyle.padding = isHorizontal
      ? `0 ${lookAheadPX + gapPX}px 0 ${lookBehindPX + gapPX}px`
      : `${lookBehindPX + gapPX}px 0 ${lookAheadPX + gapPX}px 0`

    // slideList
    const slideList = children2.map((child, i) => {
      const style = {}
      if (gap) {
        if (isHorizontal) {
          style.marginRight = gap
        } else {
          style.marginBottom = gap
        }
      }
      let active = activeIndex === i
      if (loop) {
        if (activeIndex === 0) {
          active = i === copyCount || i === count + copyCount
        } else if (activeIndex === count - 1) {
          active = i === count + (copyCount - 1) || i === copyCount - 1
        } else {
          active = activeIndex === i - copyCount
        }
      }
      return <div className="slide" key={i} style={style} data-active={active}>{child}</div>
    })
    // pagination
    let paginationNode
    if (typeof customPagination === 'function') {
      paginationNode = customPagination({
        total: React.Children.count(children),
        currentIndex: activeIndex,
      })
    } else {
      const bullets = React.Children.map(children, (child, i) => (
        <span className="bullet" key={i} data-active={activeIndex === i} />
      ))
      paginationNode = pagination && <div className="pagination">{bullets}</div>
    }

    return (
      <div className="mica-slider" data-direction={direction} style={wrapperStyle}>
        <div className="slide-wrapper" ref={this.setRefs('target')}>{slideList}</div>
        {paginationNode}
      </div>
    )
  }

  // helpers
  isHorizontal() {
    return this.props.direction === 'horizontal'
  }

  // '20px' -> 20
  // '0.2rem' -> rem2PX(0.2)
  pxGetter(raw) {
    let px = parseFloat(raw)
    if (/rem$/.test(raw)) px = rem2PX(px)

    return px
  }
}

export default Slider
