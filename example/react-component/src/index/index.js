import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Home from '../home'
import Component from '../component'
import ReduxComponent from '../redux'
import store from '../redux/middleware'

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
    <Provider store={store}>
      <Router>
        <ScrollToTop>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/component/:name" component={Component} />
            <Route exact path="/redux-component/:name" component={ReduxComponent} />
          </Switch>
        </ScrollToTop>
      </Router>
    </Provider>
  ), document.querySelector('main'),
)
