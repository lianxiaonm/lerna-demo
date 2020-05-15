import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import './style.less'

const req = require.context('../../../../packages/react-component/example', true, /\/index.js/i)

function getComponentList() {
  const componentList = req.keys().map(path => {
    const componentName = /^\.\/(.+?)\//.exec(path)[1]
    return <li key={path}><Link to={`/component/${componentName}`}>{componentName}</Link></li>
  })
  return <ul>{componentList}</ul>
}

class Home extends PureComponent {
  render() {
    return (
      <section className="home">
        <h1>react-component</h1>
        {getComponentList()}
      </section>
    )
  }
}

export default Home
