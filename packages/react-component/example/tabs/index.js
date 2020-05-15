import React, { PureComponent } from 'react'
import { Tabs, LazyLoad } from '@mini-case/react-component'
import tabpanel from './tab-panel'
import './style.less'

const { TabList, TabPanelList } = Tabs

class TabsExample extends PureComponent {
  state = { cdp: '', selectedIndex: 0 }

  onSelect = i => this.setState({ selectedIndex: i })

  componentWillMount() {
    setTimeout(() => {
      // this.setState({ cdp: 'https://gw.alipayobjects.com/zos/rmsportal/MMcxjZvIbSUsYeSDsTSo.jpg' })
    }, 2000)
  }

  render() {
    const { selectedIndex, cdp } = this.state
    const flag = false
    return (
      <div className="tabs-example">
        {cdp && <LazyLoad className="cdp" image={cdp} />}
        <Tabs selectedIndex={selectedIndex}
          onSelect={this.onSelect}
          tabScroll
          tabPanelScroll
          type="split">
          <TabList>
            {flag ? (
            <span>法师0</span>
            ) : null}
            <span>法师1</span>
            <span>法师2</span>
            <span>法师3</span>
            <span>法师4</span>
            <span>法师5</span>
            <span>法师6</span>
          </TabList>
          <TabPanelList>
            {flag ? (
              <div>
                <h1>0</h1>
                <p>我是很短很短的叶序</p>
              </div>
            ) : null}
            <div>
              <h1>1</h1>
              {tabpanel}
            </div>
            <div>
              <h1>2</h1>
              {tabpanel}
            </div>
            <div>
              <h1>3</h1>
              {tabpanel}
            </div>
            <div>
              <h1>4</h1>
              {tabpanel}
            </div>
            <div>
              <h1>5</h1>
              {tabpanel}
            </div>
            <div>
              <h1>6</h1>
              {tabpanel}
            </div>
          </TabPanelList>
          <div>
            <p>appendChild</p>
            <p>appendChild</p>
          </div>
        </Tabs>
      </div>
    )
  }
}

export default <TabsExample />
