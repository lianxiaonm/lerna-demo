import React from 'react'
import { Sticky, VirtualList,LoadMore } from '../../'
import './style.less'

const itemData = [...new Array(100)].map((_, index) => ({ index }))

const Column = ({ index })=> <div children={`Row ${index}`}/>

class VirtualListExample extends React.PureComponent {
  state = { itemList: itemData }
  
  loadMore = () => new Promise(resolve => {
    setTimeout(() => {
      const { itemList } = this.state
      this.setState({ itemList: [...itemList, ...itemList] }, resolve)
    }, 1000)
  })
  
  render() {
    const { itemList } = this.state
    return (
      <div className="virtual-list-example">
        <Sticky top={0}>
          <span className="sticky">sticky</span>
        </Sticky>
        <VirtualList
          serverHeight={document.documentElement.clientHeight}
          itemData={itemList}
          getListProps={config=> ({ ...config })}
          children={<Column/>}
        />
        <LoadMore showMore={this.loadMore} />
      </div>
    )
  }
}

export default <VirtualListExample />
