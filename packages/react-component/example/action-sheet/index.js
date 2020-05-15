import React from 'react'
import { Alert, ActionSheet } from '@mini-case/react-component'

const items = ['亚瑟', '诸葛亮', '白起']

function onClick() {
  ActionSheet.show({
    title: '选择英雄',
    items,
    destructiveBtnIndex: 0,
    cancelBtn: '取消',
    cb: ({ index: i }) => {
      if (i >= 0) {
        Alert.show({
          title: '选择的英雄',
          content: items[i],
        })
      }
    },
  })
}

export default (
  <div className="action-sheet-example">
    <span data-type="btn" onClick={onClick}>选择英雄</span>
  </div>
)
