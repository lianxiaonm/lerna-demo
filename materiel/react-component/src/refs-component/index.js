import { PureComponent } from 'react'

export default class RefsComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.$refs = {}
  }

  setRefs = (key) => (value) => {
    this.$refs[key] = value
  }
}
