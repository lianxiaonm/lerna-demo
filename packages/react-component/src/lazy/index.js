import { isValidElement } from 'react'
import PropTypes from 'prop-types'
import { isInViewport, throttle, checkType } from '@mini-case/utils'
import RefsComponent from '../refs-component'

const { isFunc } = checkType
const { object, bool } = PropTypes
const defaultCheck = { offset: 0, x: true }

const isObject = (obj) => obj && typeof obj === 'object' && !isValidElement(obj)

const reactEquals = (a, b) => {
  const aType = isObject(a)
  const bType = isObject(b)
  if (aType && aType === bType) {
    const aKey = Object.keys(a)
    const bKey = Object.keys(b)
    if (aKey.length === bKey.length) {
      return Number(aKey.every(key => reactEquals(a[key], b[key])))
    }
  } else if (
    (isFunc(a) && isFunc(b)) ||
    (isValidElement(a) && isValidElement(b))
  ) return true
  return Number(a === b)
}

class LazyComponent extends RefsComponent {
  static propTypes = { check: object, noLazy: bool }

  static instances = {}
  static count = 0
  static reactEquals = reactEquals

  static checkViewport =() => {
    const { instances } = LazyComponent
    Object.keys(instances).forEach(key => {
      const component = instances[key]
      if (component) component.checkViewport()
    })
  }

  constructor(props) {
    super(props)
    this.index = LazyComponent.count
    LazyComponent.count += 1
  }

  // 是否开始检测
  checkUpdate = () => {
    const { root } = this.$refs
    return root && !this.unmount
  }

  checkViewport = (mock) => {
    const { check, noLazy } = this.props
    const { $refs: { root }, index } = this
    if (this.checkUpdate()) {
      const { offset, x } = { ...defaultCheck, ...check }
      if (noLazy || isInViewport(root, offset, x)) {
        // 在当前 viewport，instances 移除当前实例
        delete LazyComponent.instances[index]
        this.inViewPort(mock)
      } else {
        LazyComponent.instances[index] = this
      }
    }
  }

  inViewPort = () => {}

  equalUpdate = (prev, props) => {
    if (!reactEquals(prev, props)) this.checkViewport()
  }

  componentDidUpdate(prevProps) {
    const $prop = { ...this.props, check: null }
    const $prevProp = { ...prevProps, check: null }
    this.equalUpdate($prevProp, $prop)
  }

  componentDidMount() { this.checkViewport() }

  componentWillUnmount() {
    // 卸载时，instances 移除当前实例
    delete LazyComponent.instances[this.index]
    this.unmount = true
  }
}
const checkViewport = throttle(LazyComponent.checkViewport, 200)
document.addEventListener('scroll', checkViewport, true)
document.addEventListener('transitionend', checkViewport, true)

export default LazyComponent
