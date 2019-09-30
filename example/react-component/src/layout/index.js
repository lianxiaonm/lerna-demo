import React, { useEffect } from 'react'
import './style.less'


const Layout = (props) => {
  useEffect(() => {
    console.info(props)
  }, [])
  return (
    <section className="layout">
      <h1>react-layout</h1>
    </section>
  )
}

Layout.propTypes = { }

export default Layout
