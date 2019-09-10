import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { equals } from '@mini-case/utils'

const { node } = PropTypes

const keyWrapper = (blackProps = []) => InnerComponent => {
  class OuterComponent extends PureComponent {
    static propTypes = { children: node }

    state = { key: Math.random() }

    componentWillReceiveProps(nextProps) {
      const { children } = this.props
      const { children: nextChildren } = nextProps
      // children element 每次都会重新构造，所以只比较 children 个数
      const props2 = { ...this.props, children: null }
      const nextProps2 = { ...nextProps, children: null }
      const sameChildrenCount =
        React.Children.count(children) === React.Children.count(nextChildren)
      blackProps.forEach(key => {
        delete props2[key]
        delete nextProps2[key]
      })
      if (!sameChildrenCount || !equals(props2, nextProps2)) {
        this.setState({ key: Math.random() })
      }
    }

    render() {
      return <InnerComponent key={this.state.key} {...this.props} />
    }
  }

  return OuterComponent
}

export default keyWrapper
