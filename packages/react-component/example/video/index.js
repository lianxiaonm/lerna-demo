import React from 'react'
import { Video, RefsComponent } from '@mini-case/react-component'

import './style.less'

const videolist = ['video1', 'video2', 'video3']

class VideoExp extends RefsComponent {
  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.playCallback = this.playCallback.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
  }

  playCallback = (video) => () => {
    videolist.forEach(item => {
      if (item !== video) {
        if (this.$refs[item]) {
          this.$refs[item].videoEl.pause()
        }
      }
    })
  }

  endedHandle() {
    console.log('end')
  }


  play = video => () => {
    this.$refs[video].videoEl.play()
  }

  pause = video => () => {
    this.$refs[video].videoEl.pause()
  }

  render() {
    return (
      <div className="mica-video-example">
        <div className="video-1">
          <h2>自动播放无控制条</h2>
          <Video ref={this.setRefs('video1')}
            poster="https://gw.alipayobjects.com/zos/rmsportal/ULLsojzRcaupXWptrzPH.jpg"
            src="https://oalipay-dl-django.alicdn.com/rest/1.0/file?fileIds=RGa6DoH_TVKyHcmZMXKk_wAAACMAAQED"
            autoplay
            onplay={this.playCallback('video1')}
            onended={this.endedHandle} />
        </div>
        <div>
          <h2>控件+全屏+静音</h2>
          <Video ref={this.setRefs('video2')}
            controls
            control="always"
            canfullscreen
            muted
            poster="https://oalipay-dl-django.alicdn.com/rest/1.0/image?fileIds=eDoVgproS_yjxZIwgW__ogAAACMAAQED&zoom=original"
            src="https://oalipay-dl-django.alicdn.com/rest/1.0/file?fileIds=9Hz6lgNmR8WGDV_hx3mangAAACMAAQED"
            onplay={this.playCallback('video2')} />
        </div>
        <div>
          <h2>控件+横屏</h2>
          <Video ref={this.setRefs('video3')}
            controls
            hideMuted
            controlType="vertical"
            src="https://gw.alipayobjects.com/os/rmsportal/qbgJmurqHeVMaIEyBHAx.mp4"
            onplay={this.playCallback('video3')} />
        </div>
      </div>
    )
  }
}

// http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov

export default <VideoExp />
