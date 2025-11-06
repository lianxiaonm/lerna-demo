import { PureComponent } from 'react'
import { checkType, immutable } from '@mini-case/utils'

class Immutable extends PureComponent {
  setState(updater, cb) {
    if (checkType.isNull(updater)) return super.setState(updater, cb)
    const batchState = this.batchState || this.state || {}
    this.batchState = immutable(batchState, updater)

    return super.setState(this.batchState, cb)
  }
}

export default Immutable
