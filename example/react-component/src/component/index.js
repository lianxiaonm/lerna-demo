import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './style.less'

const req = require.context('../../../../packages/react-component/example', true, /\/index.js/i)
const { object } = PropTypes

class Component extends PureComponent {
  static propTypes = {
    match: object.isRequired,
  }

  render() {
    const { name } = this.props.match.params
    const component = req(`./${name}/index.js`).default
    return (
      <section className="component">
        <h1>{name}</h1>
        {component}
      </section>
    )
  }
}

export default Component
