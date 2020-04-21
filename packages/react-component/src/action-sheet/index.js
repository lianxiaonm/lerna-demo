import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Drawer from '../drawer'
import './style.less'

const { arrayOf, string, number, func } = PropTypes

const ActionSheet = ({
  title,
  items,
  cancelButtonText = '取消',
  destructiveBtnIndex = -1,
  cb = () => false,
}) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setVisible(true) }, [])
  const sheetSelect = useCallback((i) => {
    const index = i < items.length ? i : -1
    return (e) => {
      e.stopPropagation()
      setVisible(false)
      setTimeout(() => cb({ index }), 200)
    }
  }, [items, cb])

  return (
    <Drawer visible={visible}
      className="mica-action-sheet"
      backgroundColor="rgba(0, 0, 0, 0.1)"
      onClose={sheetSelect(-1)}>
      {title && <h1>{title}</h1>}
      {items.concat(cancelButtonText).map((btn, i) => (
        <span key={i}
          data-cancelbtn={cancelButtonText === btn}
          data-active={destructiveBtnIndex === i}
          onClick={sheetSelect(i)} children={btn} />
      ))}
    </Drawer>
  )
}

ActionSheet.propTypes = {
  title: string,
  items: arrayOf(string).isRequired,
  cancelButtonText: string,
  destructiveBtnIndex: number, // 默认高亮的选项
  cb: func,
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
