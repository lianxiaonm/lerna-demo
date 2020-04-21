import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Modal from '../modal'
import './style.less'

const { string, func } = PropTypes

const Alert = ({
  title,
  content,
  buttonText = '确定',
  cb = () => false,
}) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setVisible(true) }, [])
  const onClose = useCallback((e) => {
    e.stopPropagation()
    setVisible(false)
    setTimeout(cb, 200)
  }, [cb])

  return (
    <Modal className="mica-alert" visible={visible} spaceClose={false}>
      {title && <span>{title}</span>}
      {content && <span>{content}</span>}
      <a className="btn" onClick={onClose}>{buttonText}</a>
    </Modal>
  )
}
Alert.propTypes = {
  title: string,
  content: string,
  buttonText: string,
  cb: func,
}

Alert.show = (param, cb) => {
  const props = param || { }
  let alertDom = document.querySelector('#mica-alert')
  if (!alertDom) {
    alertDom = document.createElement('div')
    alertDom.id = 'mica-alert'
    document.body.appendChild(alertDom)
  }
  ReactDOM.unmountComponentAtNode(alertDom)
  ReactDOM.render(<Alert cb={cb} {...props} />, alertDom)
}

export default Alert
