import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Home from '../home'
import Layout from '../layout'
import Component from '../component'

const { object, node } = PropTypes

@withRouter
class ScrollToTop extends Component {
  static propTypes = {
    location: object.isRequired,
    children: node,
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

ReactDOM.render(
  (
  <Router>
    <ScrollToTop>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/component/:name" component={Component} />
        <Route path="/layout" component={Layout} />
      </Switch>
    </ScrollToTop>
  </Router>
  ), document.querySelector('main'),
)
