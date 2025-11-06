import React from 'react'
import { matchPath } from 'react-router'
import PropTypes from 'prop-types'
import { Spinner, ErrorPage } from '@mini-case/react-component'

import './style.less'

const { string, array } = PropTypes

const content = <div className="spinner-body" children={<Spinner />} />

class MatchLayout extends React.PureComponent {
  static propTypes = {
    routes: array,
    pathname: string,
  }

  state = { layoutBody: content }

  loadResolve = ({ source, $chunkName }) => new Promise(resolve => {
    if (source) {
      window.require(source, () => resolve(__webpack_require__($chunkName)))
    } else resolve(ErrorPage)
  })

  matchRoute = () => {
    const { pathname, routes } = this.props
    this.setState({ layoutBody: content })
    let match = {}
    ;(routes || []).every((route) => {
      const { path, source, $chunkName } = route
      match = matchPath(pathname, { path })
      if (match) {
        match.source = source
        match.$chunkName = $chunkName
      }
      return !match
    })
    this.loadResolve(match).then(Body => {
      this.setState({ layoutBody: <Body /> })
    })
  }

  componentDidMount() { this.matchRoute() }

  componentDidUpdate(prevProps) {
    const { pathname } = this.props
    const { pathname: prePathName } = prevProps
    if (prePathName !== pathname) this.matchRoute()
  }

  render() {
    const { layoutBody } = this.state
    return (
      <section className="mica-match-layout"
        children={layoutBody} />
    )
  }
}

export default MatchLayout
