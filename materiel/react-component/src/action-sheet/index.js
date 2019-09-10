import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Drawer from '../drawer'
import './style.less'

const { arrayOf, string, number, func } = PropTypes

class ActionSheet extends PureComponent {
  static propTypes = {
    title: string,
    items: arrayOf(string).isRequired,
    cancelButtonText: string,
    destructiveBtnIndex: number, // 默认高亮的选项
    cb: func,
  }

  static defaultProps = {
    cancelButtonText: '取消',
    destructiveBtnIndex: -1,
    cb: () => {},
  }

  state = { visible: false }

  sheetSelect = i => e => {
    e.stopPropagation()
    const { items, cb } = this.props
    const index = i < items.length ? i : -1
    this.setState({ visible: false }, () => cb({ index }))
  }

  onClose = () => {
    const { cb } = this.props
    this.setState({ visible: false }, () => cb({ index: -1 }))
  }

  componentDidMount() {
    setTimeout(() => this.setState({ visible: true }), 0)
  }

  render() {
    const { title, items, cancelButtonText, destructiveBtnIndex } = this.props
    const { visible } = this.state
    const btnList = items.concat(cancelButtonText)
      .map((btn, i) => (
        <span key={i}
          data-cancelbtn={cancelButtonText === btn}
          data-active={destructiveBtnIndex === i}
          onClick={this.sheetSelect(i)}>{btn}
        </span>
      ))

    return (
      <Drawer className="mica-action-sheet"
        visible={visible}
        backgroundColor="rgba(0, 0, 0, 0.1)"
        onClose={this.onClose}>
        {title && <h1>{title}</h1>}
        {btnList}
      </Drawer>
    )
  }
}

ActionSheet.show = (param, cb) => {
  const props = param || { }
  let actionSheetDom = document.querySelector('#mica-action-sheet')
  if (!actionSheetDom) {
    actionSheetDom = document.createElement('div')
    actionSheetDom.id = 'mica-action-sheet'
    document.body.appendChild(actionSheetDom)
  }
  ReactDOM.unmountComponentAtNode(actionSheetDom)
  ReactDOM.render(<ActionSheet cb={cb} {...props} />, actionSheetDom)
}

export default ActionSheet
