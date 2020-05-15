import React from 'react'
import PropTypes from 'prop-types'
import PullElement from 'kobe-pull-element'
import { throttle } from '@mini-case/utils'
import RefsComponent from '../refs-component'
import Lazy from '../lazy'
import './style.less'

const { node, bool, number, string, func, oneOf } = PropTypes

const toFixed = value => Math.floor(value * 100) / 100

class Slider extends RefsComponent {
  static propTypes = {
    children: node.isRequired,
    gap: string,
    initialSlide: number,
    slidesPerView: number,
    slidesPerGroup: number,
    direction: oneOf(['horizontal', 'vertical']),
    lookAhead: string,
    lookBehind: string,
    pagination: bool,
    translateZ: bool,
    onSlide: func,
  }

  static defaultProps = {
    gap: '0px',
    initialSlide: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    direction: 'horizontal',
    lookAhead: '0px',
    lookBehind: '0px',
    pagination: true,
    translateZ: true,
    onSlide: () => false,
  }

  constructor(props) {
    super(props)
    const { initialSlide, children } = props
    this.$refs = {}
    this.unmount = false
    this.count = React.Children.count(children)
    this.state = { activeIndex: initialSlide }
  }

  componentDidMount() {
    this.initPullElement()
    this.onResize()
    window.addEventListener('resize', this.onResize, true)
  }

  componentDidUpdate(prevProps) {
    const { count } = this
    const { children, slidesPerView } = this.props
    this.count = React.Children.count(children)
    if (count !== this.count) {
      if (this.pullElement) this.pullElement.destroy()
      this.initPullElement()
    }
    if (slidesPerView !== prevProps.slidesPerView) this.onResize()
  }

  componentWillUnmount() {
    this.unmount = true
    window.removeEventListener('resize', this.onResize, true)
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

  onResize = throttle(() => {
    if (this.unmount) return
    const gapPX = this.getGapPx()
    const { height, width } = this.getPadOffset()
    const isHorizontal = this.isHorizontal()

    const { childNodes } = this.$refs.target || { childNodes: [] };
    [].slice.call(childNodes).forEach(child => {
      if (isHorizontal) {
        child.style.marginRight = `${gapPX}px`
        child.style.width = `${width}px`
      } else {
        child.style.marginBottom = `${gapPX}px`
        child.style.height = `${height}px`
      }
    })
    this.switchSlide(this.state.activeIndex, false)
  }, 100 / 6)

  initPullElement() {
    const component = this
    const isHorizontal = this.isHorizontal()

    function handlePullEnd({ translateX, translateY }) {
      this.preventDefault()
      const { activeIndex } = component.state
      const {
        translateX: prevTranslateX,
        translateY: prevTranslateY,
      } = component.calculateDistance({ translateIndex: activeIndex })
      const diff = isHorizontal
        ? translateX - prevTranslateX
        : translateY - prevTranslateY
      if (diff > 20) component.switchPrev(true)
      else if (diff < -20) component.switchNext(true)
      else component.switchSlide(activeIndex, true)
    }

    const side = isHorizontal ? 'Left' : 'Up'
    const side2 = isHorizontal ? 'Right' : 'Down'
    this.pullElement = new PullElement({
      wait: false,
      target: this.$refs.target,
      transitionProperty: 'transform',
      [`onPull${side}End`]: handlePullEnd,
      [`onPull${side2}End`]: handlePullEnd,
      translateZ: this.props.translateZ,
    })
    this.pullElement.init()
  }

  // 计算偏移量
  indexGetter = index => {
    const { count } = this
    const { slidesPerGroup, slidesPerView } = this.props
    let current = index
    if (current < 0) return 0
    if (slidesPerGroup > 1) current += 1
    // 判断最后一个是否在视窗内
    if (current > count - slidesPerView) {
      current = count - slidesPerView
    }
    return Math.floor(current / slidesPerGroup) * slidesPerGroup
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
    const activeIndex = this.indexGetter(index)
    const { translateX, translateY } = this.calculateDistance({
      translateIndex: activeIndex,
    })

    const animateTo = () => {
      if (this.unmount || !this.pullElement) return
      this.setState({ activeIndex })
      this.pullElement.animateTo(translateX, translateY)
        .then(() => onSlide(activeIndex))
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
      children, pagination, direction, customPagination,
    } = this.props
    const { activeIndex } = this.state
    const children2 = React.Children.toArray(children)

    // slideList
    const slideList = children2.map((child, i) => (
      <div key={i} data-active={activeIndex === i}
        className="slide" children={child} />
    ))
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
      <div className="mica-slider" data-direction={direction}>
        <div className="slide-wrapper" ref={this.setRefs('target')}>{slideList}</div>
        {paginationNode}
      </div>
    )
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
