import React, { PureComponent } from 'react'
import { buildUrl, loadScript, equals } from '@mini-case/utils'
import PropTypes from 'prop-types'
import './style.less'

const { string } = PropTypes
const mapStartIcon = require('./images/map-icon-qi.svg')
const mapEndIcon = require('./images/map-icon-zhong.svg')

// 这里用来代替window.AMap的写法，两者不同；全局可访问到的其实还是window.AMap
let AMap

// 缺少地理位置参数
const checkProps = ({ iLat, iLon, desLat, desLon }) => !!(iLon && iLat && desLat && desLon)

export default class Map extends PureComponent {
  static propTypes = {
    iLon: string.isRequired,
    iLat: string.isRequired,
    desLon: string.isRequired,
    desLat: string.isRequired,
  }

  choosedMapType = ''
  hasLoadAMapMap = false
  distanceMap = 0
  amap = null

  state = { showMap: false, mapCont: '' }

  componentDidMount() {
    this.updateAmap(checkProps(this.props))
  }

  componentWillUnmount() {
    // 销毁地图，并清空地图容器
    if (this.amap) this.amap.destroy()
  }

  // static getDerivedStateFromProps(props, state) {}

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    const showMap1 = checkProps(nextProps)
    if (equals(this.props, nextProps)) {
      this.updateAmap(showMap1)
    }
  }

  updateAmap = (showMap1) => {
    const { showMap } = this.state
    if (showMap !== showMap1) {
      this.setState({ showMap: showMap1 }, () => {
        // 销毁地图，并清空地图容器
        if (this.amap) this.amap.destroy()
        // 生成地图
        if (showMap1) this.loadAMapAndCallback()
      })
    }
  }

  loadAMapCb = () => {
    AMap = window.AMap
    if (AMap) this.buildMap()
    else {
      this.setState({ showMap: false })
    }
  }

  loadAMapAndCallback = () => {
    if (!this.hasLoadAMapCallBack) {
      this.hasLoadAMapCallBack = true
      // amap js第一次加载之后，会自动执行一次onAMapLoad回调
      window.onAMapLoad = this.loadAMapCb
    } else {
      // 页面上已加载amap.js之后，再次重新更新地图时执行
      this.loadAMapCb()
    }

    if (!this.hasLoadAMapMap) {
      this.hasLoadAMapMap = true
      loadScript(buildUrl('https://webapi.amap.com/maps', {
        v: '1.4.10', callback: 'onAMapLoad',
        key: '283ae07b7c4a1164bdcfb0fa324eaeb1',
      }))
    }
  }

  // 时间和距离如果计算出来是0， 就显示为1
  formatMile = dis => {
    if (dis > 1000) {
      // 保留1位小数
      return `${Math.floor(dis / 100) / 10 || 1}公里`
    }
    return `${parseInt(dis, 10) || 1}米`
  }

  formatSecToMin = (time) => (Math.floor(time / 60) ? Math.floor(time / 60) : 1)

  formatDesCont = result => {
    const { choosedMapType } = this
    const { routes = [] } = result || { }
    if (!routes[0]) return ''

    const { distance, time } = routes[0]
    const distanceFormated = this.formatMile(distance)
    const timeFormated = this.formatSecToMin(time)

    switch (choosedMapType) {
      case 'walk':
        return `距你${distanceFormated}, 步行约${timeFormated}分钟`
      case 'car':
        if (distance < 100000) {
          return `距你${distanceFormated}, 开车约${timeFormated}分钟`
        }
        return `距你${distanceFormated}`
      default:
    }
    return ''
  }

  buildMapCont = result => {
    const desCont = this.formatDesCont(result)
    this.setState({ mapCont: desCont })
  }

  buildMapMasker = ({ result, iPos, desPos }) => {
    const startMarker = new AMap.Marker({
      icon: new AMap.Icon({
        size: new AMap.Size(40, 54),
        image: mapStartIcon,
        imageSize: new AMap.Size(40, 54),
      }),
      offset: new AMap.Pixel(-20, -50),
      position: iPos,
    })
    const desMarker = new AMap.Marker({
      icon: new AMap.Icon({
        size: new AMap.Size(40, 54),
        image: mapEndIcon,
        imageSize: new AMap.Size(40, 54),
      }),
      offset: new AMap.Pixel(-20, -50),
      position: desPos,
    })

    const markerList = [startMarker, desMarker]
    const setViewList = markerList.slice()
    this.amap.add(markerList)

    // 直线距离小于50米，不展示路线规划
    if (this.distanceMap > 50) {
      const route = result.routes && result.routes[0]
      if (route) {
        const path = this.parseRouteToPath(route)
        const routeLine = new AMap.Polyline({
          path,
          borderWeight: 2,
          strokeWeight: 4,
          strokeColor: '#FF7600',
          lineJoin: 'round',
        })
        routeLine.setMap(this.amap)
        setViewList.push(routeLine)
      }
    }

    this.amap.setFitView(setViewList)
  }

  // 解析路径为路线数组
  parseRouteToPath = (route = {}) => {
    const { steps = [] } = route
    const paths = steps.reduce((a, step) => {
      const { path = [] } = step || { }
      return a.concat(
        path.reduce((c, d) => c.concat(d), []),
      )
    }, [])
    return paths
  }

  buildMap = () => {
    const { iLon, iLat, desLat, desLon } = this.props
    const desPos = [desLon, desLat]
    const iPos = [iLon, iLat]

    // 返回 p1 到 p2 间的地面距离，单位：米
    this.distanceMap = Math.ceil(AMap.GeometryUtil.distanceOfLine([desPos, iPos]))
    this.amap = new AMap.Map('amap-container', {
      resizeEnable: true,
      expandZoomRange: true,
      dragEnable: false,
      doubleClickZoom: false,
      touchZoom: false,
      // 关闭websocket，之后走ajax的方式获取地图数据(因怀疑与r.readystate 错误有关而加的配置)
      disableSocket: true,
      mapStyle: 'amap://styles/whitesmoke',
    })

    // 异步同时加载多个插件
    AMap.plugin(['AMap.Driving', 'AMap.Walking'], () => {
      if (this.distanceMap <= 1000) {
        const walking = new AMap.Walking({ hideMarkers: true })
        walking.search(desPos, iPos, (status, result = {}) => {
          this.choosedMapType = 'walk'
          this.buildMapMasker({ iPos, desPos, result })
          this.buildMapCont(result)
        })
      } else {
        const driving = new AMap.Driving({
          policy: AMap.DrivingPolicy.LEAST_TIME,
          hideMarkers: true,
        })
        driving.search(desPos, iPos, (status, result = {}) => {
          this.choosedMapType = 'car'
          this.buildMapMasker({ iPos, desPos, result })
          this.buildMapCont(result)
        })
      }
    })
  }

  // 新窗口展示地图组件
  goFullMap = () => {
    const { iLon, iLat, desLat, desLon } = this.props
    const url = buildUrl('http://m.amap.com/navi/', {
      start: `${iLon},${iLat}`,
      dest: `${desLon},${desLat}`,
      key: '283ae07b7c4a1164bdcfb0fa324eaeb1',
      naviBy: this.choosedMapType === 'walk' ? 'walk' : 'car',
    })
    console.log(url)
  }

  render() {
    const { showMap, mapCont } = this.state
    return !showMap ? null : (
      <div className="mica-amap-wrapper amap-wrapper">
        <div id="amap-container" />
        <div className="amap-mask" onClick={this.goFullMap} />
        {mapCont && <div className="amap-cont">{mapCont}</div>}
      </div>
    )
  }
}
