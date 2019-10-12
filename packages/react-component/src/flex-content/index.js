import React from 'react'
import PropTypes from 'prop-types'
import RefsComponent from '../refs-component'
import './style.less'

const { string, node, number, oneOfType } = PropTypes

class FlexContent extends RefsComponent {
  static propTypes = {
    content: oneOfType([string, node]).isRequired,
    line: number.isRequired,
    expandText: string,
    retractText: string,
  }

  static defaultProps = {
    expandText: '全文',
    retractText: '收起',
  }

  state = {
    expanding: false,
    showFlex: false,
  }

  clickHandle = () => {
    const { expanding } = this.state
    this.setState({ expanding: !expanding })
  }

  updateStyle = () => {
    const { line } = this.props
    const { expanding } = this.state
    const { content } = this.$refs
    if (content instanceof Element) {
      content.style.WebkitLineClamp = expanding ? null : line
    }
  }

  componentDidMount() {
    this.updateStyle()
    const { content } = this.$refs
    if (content instanceof Element) {
      const { offsetHeight, scrollHeight } = content
      if (offsetHeight < scrollHeight) {
        this.setState({ showFlex: true })
      }
    }
  }

  componentDidUpdate() { this.updateStyle() }

  render() {
    const { content, expandText, retractText } = this.props
    const { expanding, showFlex } = this.state
    return (
      <div className="mica-flex-content" data-expanding={expanding} onClick={this.clickHandle}>
        <div className="content" ref={this.setRefs('content')}>{content}</div>
        {showFlex && <span className="btn">{expanding ? retractText : expandText}</span>}
      </div>
    )
  }
}

export default FlexContent
