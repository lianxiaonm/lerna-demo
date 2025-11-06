import React from 'react'
import PropTypes from 'prop-types'
import { VariableSizeList as List } from 'react-window'
import { WindowScroller } from 'react-virtualized'
import RefsComponent from '../refs-component'
import EmptyPage from '../empty-page'

import './style.less'

const { string, bool, object, array, number, func, node } = PropTypes

const defaultSize = () => 80

class VirtualList extends RefsComponent {
  static propTypes = {
    selector: string,
    serverHeight: number,
    itemData: array,
    loading: bool,
    getListProps: func,
    emptyNode: node,
    children: node,
    style: object,
  }

  static defaultProps = {
    style: { },
    itemData: [],
    serverHeight: 500,
    getListProps: config => config,
    emptyNode: <EmptyPage content="no data" iconHeight="120px" />,
  }

  state = { scrollElement: undefined }

  handleScroll = ({ scrollTop }) => {
    const { listRef } = this.$refs
    if (listRef) listRef.scrollTo(scrollTop)
  }

  setScrollEl = () => {
    const { selector } = this.props
    const scrollElement = !selector ? window : document.querySelector(selector)
    this.setState({ scrollElement })
  }
  componentDidUpdate(prevProps) {
    const { selector } = this.props
    if (prevProps.selector !== selector) this.setScrollEl()
  }

  componentDidMount() {
    this.setScrollEl()
  }

  renderRow = ({ index, style: rowStyle, data }) => (
    <div className="mica-virtual-row" style={rowStyle}>
      { React.cloneElement(this.props.children, data[index]) }
    </div>
  )

  render() {
    const { serverHeight, itemData, loading, getListProps, emptyNode, style } = this.props
    const { scrollElement } = this.state

    const isEmpty = !loading && !itemData.length

    return (
      <div className="mica-virtual-list" style={{ minHeight: serverHeight, ...style }}>
        {!isEmpty ? (
          <WindowScroller scrollElement={scrollElement}
            scrollingResetTimeInterval={100 / 3}
            onScroll={this.handleScroll}>
            {({ height }) => (
              <List ref={this.setRefs('listRef')}
                itemData={itemData}
                itemSize={defaultSize}
                itemCount={itemData.length}
                {...getListProps({
                  width: '100%',
                  height: Math.max(serverHeight, height),
                  style: { height: scrollElement ? '100%' : serverHeight },
                })}
                children={this.renderRow} />
            )}
          </WindowScroller>
        ) : emptyNode}
      </div>
    )
  }
}
export default VirtualList
