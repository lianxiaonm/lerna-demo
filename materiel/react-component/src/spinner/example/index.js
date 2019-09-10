import React, { PureComponent } from 'react'
import { Spinner } from '@mini-case/react-component'

import './style.less'

class ProgressExample extends PureComponent {
  render() {
    return (
      <div className="spinner-example">
        <Spinner type="ios" />
        <Spinner type="ios-small" />
        <Spinner type="bubbles" />
        <Spinner type="circles" />
        <Spinner type="dots" />
        <Spinner type="spiral" />
        <Spinner type="lines" />
        <Spinner type="crescent" />
        <Spinner type="ripple" />
        <Spinner type="other" />
      </div>
    )
  }
}

export default <ProgressExample />
