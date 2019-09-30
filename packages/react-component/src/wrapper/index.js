import React, { PureComponent } from 'react'
import { getParam } from '@mini-case/utils'
import ErrorPage from '../error-page'

// handleError: 自定义错误处理函数
// hideLoading: loadProps 结束是否关闭 loading
const wrapper = (args) => InnerComponent => {
  const {
    handleError,
    transparent = false,
  } = args || { }

  if (transparent) document.documentElement.setAttribute('data-transparent', true)

  const { loadProps = () => Promise.resolve() } = InnerComponent

  class OuterComponent extends PureComponent {
    constructor(props) {
      super(props)
      const param = getParam()
      this.param = { ...param, ...props }
      this.state = { data: null, err: null }
    }

    reload = (...args2) => this.loadData(...args2)

    componentWillMount() { this.loadData() }

    loadData = (extra) => loadProps(this.param, extra)
      .then((data = {}) => this.setState({ data, err: null }))
      .catch(err => this.setState({ err, data: null }))

    render() {
      const { data, err } = this.state
      // loading
      if (!data && !err) return null
      // handle error
      if (err) {
        const { error } = err
        let type = 'error'
        let handleErrorResult = null
        if (+error === 10 || +error === 2) type = 'no-network'
        if (+error === 1002 || +error === 6666) type = 'page-result-limiting'
        if (handleError) handleErrorResult = handleError(err, this.reload, type)
        if (handleErrorResult) return handleErrorResult
        return <ErrorPage transparentTitle={transparent} reload={this.reload} type={type} />
      }
      return <InnerComponent {...this.param} initData={data} reload={this.reload} />
    }
  }
  return OuterComponent
}

export default wrapper
