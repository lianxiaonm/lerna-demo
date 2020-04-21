import React, {
  useRef, useState, useCallback, useEffect,
} from 'react'
import PropTypes from 'prop-types'
import { VariableSizeList as List } from 'react-window'
import { WindowScroller } from 'react-virtualized'
import EmptyPage from '../empty-page'

import './style.less'

const { string, bool, object, array, number, func, node } = PropTypes

const defaultSize = () => 80

const VirtualList = ({
  selector,
  serverHeight = 500,
  itemData = [],
  loading = false,
  getListProps = config => config,
  emptyNode = <EmptyPage content="no data" iconHeight="120px" />,
  style = { },
  children,
}) => {
  const listRef = useRef(null)

  const handleScroll = useCallback(({ scrollTop }) => {
    if (!listRef || !listRef.current) return
    listRef.current.scrollTo(scrollTop)
  }, [])

  const isEmpty = !loading && !itemData.length

  const [scrollElement, setElement] = useState()

  useEffect(() => {
    if (!selector) setElement(window)
    else setElement(document.querySelector(selector))
  }, [selector])

  const renderFn = useCallback(({ index, style: rowStyle, data }) => (
    <div className="mica-virtual-row" style={rowStyle}>
      { React.cloneElement(children, data[index]) }
    </div>
  ), [])

  return (
    <div className="mica-virtual-list" style={{ minHeight: serverHeight, ...style }}>
      {!isEmpty ? (
        <WindowScroller scrollingResetTimeInterval={100 / 3}
          scrollElement={scrollElement} onScroll={handleScroll}>
          {({ height }) => (
            <List ref={listRef}
              itemData={itemData}
              itemSize={defaultSize}
              itemCount={itemData.length}
              {...getListProps({
                width: '100%',
                height: Math.max(serverHeight, height),
                style: { height: scrollElement ? '100%' : serverHeight },
              })}>
              { renderFn }
            </List>
          )}
        </WindowScroller>
      ) : emptyNode}
    </div>
  )
}

VirtualList.propTypes = {
  selector: string,
  serverHeight: number,
  itemData: array,
  loading: bool,
  actionLoading: bool,
  getListProps: func,
  emptyNode: node,
  children: node,
  style: object,
}

export default React.memo(VirtualList)
