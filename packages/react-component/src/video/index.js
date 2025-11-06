import React from 'react'
import PropTypes from 'prop-types'
import Animate from '../animate'
import LazyLoad from '../lazy-load'
import Immutable from '../immutable'
import { EVENTS, PROPERTIES } from './constans'
import './style.less'

const { string, oneOf, func, bool } = PropTypes

const inWx = /micromessenger/i.test(navigator.userAgent)

export default class Video extends Immutable {
  static propTypes = {
    controls: bool,
    control: oneOf(['always', 'auto']),
    controlType: oneOf(['vertical', 'horizontal']),
    autoplay: bool,
    canfullscreen: bool,
    muted: bool,
    hideMuted: bool,
    src: string,
    poster: string,
    orient: oneOf(['vertical', 'horizontal']),
    loop: bool,
    onPlay: func,
    onEnded: func,
    onWaiting: func,
    onPause: func,
    onAbort: func,
    onCanPlay: func,
    onCanPlayThrough: func,
    onDurationChange: func,
    onEmptied: func,
    onError: func,
    onLoadedData: func,
    onTimeUpdate: func,
    rawControls: bool,
    fullScreenCallback: func,
  }

  static defaultProps = {
    control: 'auto',
    rawControls: true,
    orient: 'horizontal',
    controlType: 'horizontal',
  }

  constructor(props) {
    super(props)
    const { controls, muted } = props
    const { clientWidth, clientHeight } = document.documentElement
    this.fullHeight = `${clientWidth}px`
    this.fullWidth = `${clientHeight}px`
    // remove timeUpdate render
    this.events = controls ? EVENTS : EVENTS.slice(1)

    this.state = {
      showControls: controls,
      muted,
      controlsVisible: false,
      autoplayInit: false,
      style: { transformOrigin: `${clientHeight / 2}px ${clientHeight / 2}px` },
      fullscreen: false,
      played: false,
    }
  }

  componentDidMount() { this.videoDomCreate() }

  componentWillUnmount() { this.unbindEvents() }

  // It's all because of raw-controls
  videoDomCreate = () => {
    const {
      controls, autoplay, src, poster, orient,
      loop, rawControls, ...restEventProps
    } = this.props

    const video = document.createElement('video')
    video.loop = loop
    video.playsInline = true

    const source = document.createElement('source')
    source.src = src
    source.type = 'video/mp4'
    source.preload = 'metadata'
    video.appendChild(source)

    if (rawControls) {
      video.setAttribute('raw-controls', true)
      video.setAttribute('webkit-playsinline', true)
      video.setAttribute('playsinline', true)
    }

    if (inWx) {
      video.setAttribute('x5-video-player-type', 'h5')
      video.setAttribute('x5-video-player-fullscreen', true)
    }

    if (restEventProps) {
      Object.keys(restEventProps).forEach(key => {
        if (restEventProps[key]) {
          video[key] = restEventProps[key]
        }
      })
    }

    const videoWrapper = this.el.querySelector('.video-wrapper .video')
    videoWrapper.appendChild(video)

    this.videoEl = this.el.querySelector('.video-wrapper video')
    this.bindEventsToUpdateState()
  }

  updateState = (e) => {
    const { type } = e
    if (type === 'play') this.playHandler()
    this.setState(PROPERTIES.reduce((p, c) => {
      const pp = p
      pp[c] = this.videoEl && this.videoEl[c]
      return pp
    }, {}))
  }

  playHandler() {
    const { controls, control } = this.props
    this.setState({ played: true })
    if (controls) {
      this.setState({ controlsVisible: true })
      if (control === 'auto') {
        this.clearControls()
        this.toggleTimer()
      }
    }
  }

  bindEventsToUpdateState() {
    this.events.forEach(event => {
      this.videoEl.addEventListener(event.toLowerCase(), this.updateState)
    })
  }

  unbindEvents() {
    this.events.forEach(event => {
      this.videoEl.removeEventListener(event.toLowerCase(), this.updateState)
    })

    const sources = this.videoEl.getElementsByTagName('source')
    if (sources.length) {
      const lastSource = sources[sources.length - 1]
      lastSource.removeEventListener('error', this.updateState)
    }
  }

  setRef = (el) => { this.el = el }

  formatTime(seconds) {
    const date = new Date(Date.UTC(1970, 1, 1, 0, 0, 0, 0))
    const sec = window.isNaN(seconds) || seconds > 86400 ? 0 : Math.floor(seconds)
    date.setSeconds(sec)
    const duration = date.toISOString().substr(11, 8).replace(/^0{1,2}:?/, '')
    return duration
  }

  onPlayPauseClick = (source) => () => {
    const { videoEl, state: { paused }, props: { control } } = this

    if (paused || paused === undefined) {
      videoEl.play()
    } else videoEl.pause()

    if (source === 'controls' && control === 'auto') {
      this.clearControls()
      this.toggleTimer()
    }
  }

  toggleControls() {
    const { controlsVisible } = this.state
    this.setState({ controlsVisible: !controlsVisible })
  }

  onChange = (e) => {
    const { videoEl } = this
    const { duration } = this.state
    const { control } = this.props
    videoEl.currentTime = Math.floor(e.target.value * duration) / 100

    if (control === 'auto') {
      this.clearControls()
      this.toggleTimer()
    }
  }

  videoClick = () => {
    const {
      videoEl, loading,
      state: { played, controlsVisible, paused },
      props: { control, controls },
    } = this
    if (!loading) {
      if (!controls) {
        if (paused) videoEl.play()
        else videoEl.pause()
      } else if (played && control === 'auto') {
        this.toggleControls()
        this.clearControls()
        if (!controlsVisible) {
          this.toggleTimer()
        }
      }
    }
  }

  videoTouch = (e) => {
    const { fullscreen } = this.state
    const { tagName, type } = e.target
    if (!/^input$/i.test(tagName)
      && type !== 'range'
      && fullscreen) {
      e.preventDefault()
    }
  }

  clearControls() {
    const { toggleControlsTimer } = this
    if (toggleControlsTimer) {
      clearTimeout(toggleControlsTimer)
      this.toggleControlsTimer = null
    }
  }

  toggleTimer() {
    this.toggleControlsTimer = setTimeout(() => {
      this.toggleControls()
    }, 3000)
  }

  toggleFullScreen = () => {
    const { fullHeight, fullWidth } = this
    const { fullscreen } = this.state
    const { orient, fullScreenCallback } = this.props

    if (fullScreenCallback) {
      fullScreenCallback(this.videoEl)
      return
    }

    const isFull = !fullscreen && orient === 'horizontal'

    this.setState({
      ['style.width']: isFull ? fullWidth : null, // eslint-disable-line
      ['style.height']: isFull ? fullHeight : null, // eslint-disable-line
      fullscreen: !fullscreen,
    })
  }

  toggleMuted = () => {
    const { control } = this.props
    const { muted } = this.state
    this.videoEl.muted = !muted
    this.setState({ muted: !muted })
    if (control === 'auto') {
      this.clearControls()
      this.toggleTimer()
    }
  }

  handlerRangeTouchStart = () => {
    this.setState({ rangeTouch: true })
  }

  handlerRangeTouchEnd = () => {
    this.setState({ rangeTouch: false })
  }

  render() {
    const {
      orient, controlType, poster, canfullscreen, hideMuted,
    } = this.props
    const {
      showControls, controlsVisible,
      style, fullscreen,
      currentTime, duration, paused, error, readyState, networkState, played,
      rangeTouch, muted,
    } = this.state

    this.loading = readyState < (/iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : 4)
    const videoError = error || networkState === 3
    const percentagePlayed = (currentTime / duration) * 100

    const fullType = fullscreen ? orient : null
    const isControlHorizontal = controlType === 'horizontal'

    let showOverPlay = paused === true
    if (!played) showOverPlay = true

    return (
      <div className="mica-video" data-fullscreen={fullType} ref={this.setRef}>
        <div className="video-holder" style={style}>
          <div className="video-wrapper">
            <div className="video" />
            {poster && !played && <LazyLoad image={poster} type="" />}
            <div className="video-handler" onClick={this.videoClick} onTouchMove={this.videoTouch} />
          </div>
          {!videoError && (
            <div>
              {showOverPlay && <div className="overlay-play" onClick={this.onPlayPauseClick('overlay')} />}
              {showControls && (
                <Animate showProp="data-show" transitionName="fade" component="div">
                  <div className="controls-wrapper" data-show={controlsVisible} onTouchMove={this.videoTouch}>
                    <div>
                      <div className="btn-play" data-paused={paused} onClick={this.onPlayPauseClick('controls')} />
                      <div className="timeline" data-horizontal={isControlHorizontal}>
                        {isControlHorizontal && <div className="time-currrent">{this.formatTime(currentTime)}</div>}
                        <div className="track">
                          <div className="base" />
                          <div className="buffer" style={{ width: `${percentagePlayed || 0}%` }} />
                          <input data-ontouch={rangeTouch}
                            type="range" min="0" max="100" step="1" orient="horizontal"
                            onTouchStart={this.handlerRangeTouchStart}
                            onTouchEnd={this.handlerRangeTouchEnd}
                            onChange={this.onChange} value={percentagePlayed || 0} />
                        </div>
                        {
                          isControlHorizontal ?
                            <div className="time-duration">{this.formatTime(duration)}</div> :
                            (
                              <div className="times">
                                <div>{this.formatTime(currentTime)}</div>
                                <div>{this.formatTime(duration)}</div>
                              </div>
                            )
                        }
                      </div>
                      {canfullscreen && <div className="btn-full-screen" onClick={this.toggleFullScreen} />}
                      {!hideMuted && <div data-muted={muted} className="btn-muted" onClick={this.toggleMuted} />}
                    </div>
                  </div>
                </Animate>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}
