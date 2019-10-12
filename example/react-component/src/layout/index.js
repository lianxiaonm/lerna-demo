import React, { useEffect, useState, createElement } from 'react'
import { matchPath } from 'react-router'
import PropTypes from 'prop-types'
import { Spinner, ErrorPage } from "@mini-case/react-component";

import './style.less'

const { object, shape, string, number, func } = PropTypes

const routes = process.env.ROUTES || []

const content = (
  <div className="spinner-body">
    <Spinner/>
  </div>
)
const Layout = (props) => {
  const [{ content: layoutBody }, setContent] = useState({ content })
  useEffect(() => {
    setContent({ content })
    const { pathname } = props.location
    let $match
    routes.every((route) => {
      const { path, source, $chunkName } = route
      $match = matchPath(pathname, { path })
      if ($match) {
        $match.source = source
        $match.$chunkName = $chunkName
      }
      return !$match
    })
    if ($match && $match.source) {
      window.require($match.source, () => {
        const index = __webpack_require__($match.$chunkName)
        setContent({ content: createElement(index.default, { ...props }) })
      })
    } else setContent({ content: <ErrorPage/> })
  }, [props.location])
  return (
    <section className="layout">
      <h1>react-layout</h1>
      {layoutBody}
    </section>
  )
}

Layout.propTypes = {
  location: shape({
    pathname: string,
    search: string,
    hash: string,
  }),
  history: shape({
    length: number,
    action: string,
    location: object,
    createHref: func,
    push: func,
  }),
}

export default Layout
