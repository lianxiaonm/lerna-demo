import React from 'react'
import PropTypes from 'prop-types'
import Lazy from '../lazy'
import './style.less'

const { string, number, bool, oneOf } = PropTypes

export default class LazyLoad extends Lazy {
  static propTypes = {
    image: string,
    type: string,
    quality: number,
    scale: number,
    mode: oneOf(['cover', 'contain']),
    round: bool,
    mask: bool,
    shortSide: bool,
    className: string,
  }

  static defaultProps = {
    image: '',
    type: 'smallShop',
    quality: 90,
    scale: 1,
    round: false,
    mask: true,
    shortSide: false,
    offset: 20,
    x: false,
    className: '',
  }

  state = { image: '', fuzzy: '' }

  inViewPort = () => {
    const { scale } = this.props
    this.getImage(scale).then(newImage => {
      if (!this.unmount && newImage) {
        this.setState({ image: newImage })
      }
    })
  }

  getImage = () => {
    const { image } = this.props
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.addEventListener('load', () => resolve(image))
      img.addEventListener('error', () => reject(new Error('image load error')))
      img.src = image
    })
  }

  render() {
    const { type, round, className, mask, mode } = this.props
    const { image, fuzzy } = this.state
    let img = null // 实际渲染图
    let placeholder = null // 占位图
    if (image) {
      const imageStyle = { backgroundSize: mode, backgroundImage: `url(${image})` }
      img = <div className="img" style={imageStyle} />
    } else {
      const placeholderStyle = fuzzy ? { backgroundImage: `url(${fuzzy})` } : null
      placeholder = <div className="placeholder" style={placeholderStyle} data-type={type} />
    }
    return (
      <div className={`mica-lazy-load ${className}`}
        ref={this.setRefs('root')}
        data-image={!!image}
        data-mask={mask} data-round={round}>
        {image ? img : placeholder}
      </div>
    )
  }
}
