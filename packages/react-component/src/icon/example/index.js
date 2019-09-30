import React, { PureComponent } from 'react'
import { Icon } from '@mini-case/react-component'
import './style.less'

const icons = [
  { keyCode: '64e', type: 'loading' },
  { keyCode: '609', type: 'loading1' },
  { keyCode: '7ca', type: 'ask' },
  { keyCode: '7c9', type: 'ask-fill' },
  { keyCode: '78d', type: 'emoji-fill' },
  { keyCode: '768', type: 'move' },
  { keyCode: '767', type: 'add' },
  { keyCode: '763', type: 'radio-box-fill' },
  //
  { keyCode: '759', type: 'post' },
  { keyCode: '731', type: 'mark' },
  { keyCode: '730', type: 'mark-fill' },
  { keyCode: '727', type: 'camera-add-fill' },
  { keyCode: '724', type: 'camera-add' },
  { keyCode: '71c', type: 'male' },
  { keyCode: '71a', type: 'female' },
  { keyCode: '70b', type: 'qiang' },
  //
  { keyCode: '70a', type: 'notice' },
  { keyCode: '709', type: 'notice-fill' },
  { keyCode: '708', type: 'countdown' },
  { keyCode: '707', type: 'countdown-fill' },
  { keyCode: '6fb', type: 'barcode' },
  { keyCode: '6f3', type: 'share' },
  { keyCode: '6f2', type: 'wifi' },
  { keyCode: '6ee', type: 'vip-card' },
  //
  { keyCode: '6ed', type: 'recharge' },
  { keyCode: '6ec', type: 'recharge-fill' },
  { keyCode: '6e5', type: 'info' },
  { keyCode: '6e4', type: 'info-fill' },
  { keyCode: '6e3', type: 'appreciate-fill' },
  { keyCode: '6de', type: 'fold' },
  { keyCode: '6d9', type: 'round-add' },
  { keyCode: '6d8', type: 'round-add-fill' },
  //
  { keyCode: '6d7', type: 'round' },
  { keyCode: '6d6', type: 'square-check' },
  { keyCode: '6d5', type: 'square' },
  { keyCode: '6d4', type: 'square-check-fill' },
  { keyCode: '6d3', type: 'present' },
  { keyCode: '6bd', type: 'address-book' },
  { keyCode: '6b4', type: 'delete' },
  { keyCode: '6b2', type: 'remind' },
  //
  { keyCode: '6b0', type: 'qr-code' },
  { keyCode: '6a6', type: 'delete-fill' },
  { keyCode: '6a5', type: 'more-android' },
  { keyCode: '6a4', type: 'refresh' },
  { keyCode: '6a3', type: 'right' },
  { keyCode: '69e', type: 'top' },
  { keyCode: '69c', type: 'filter' },
  { keyCode: '69b', type: 'pic' },
  //
  { keyCode: '691', type: 'question' },
  { keyCode: '690', type: 'question-fill' },
  { keyCode: '689', type: 'scan' },
  { keyCode: '684', type: 'more' },
  { keyCode: '682', type: 'list' },
  { keyCode: '67c', type: 'cascades' },
  { keyCode: '679', type: 'back' },
  { keyCode: '669', type: 'like' },
  //
  { keyCode: '668', type: 'like-fill' },
  { keyCode: '667', type: 'comment' },
  { keyCode: '666', type: 'comment-fill' },
  { keyCode: '665', type: 'camera' },
  { keyCode: '664', type: 'camera-fill' },
  { keyCode: '663', type: 'warn' },
  { keyCode: '662', type: 'warn-fill' },
  { keyCode: '661', type: 'unfold' },
  //
  { keyCode: '65f', type: 'time' },
  { keyCode: '65e', type: 'time-fill' },
  { keyCode: '65c', type: 'search' },
  { keyCode: '659', type: 'round-close' },
  { keyCode: '658', type: 'round-close-fill' },
  { keyCode: '657', type: 'round-check' },
  { keyCode: '656', type: 'round-check-fill' },
  { keyCode: '652', type: 'phone' },
  //
  { keyCode: '651', type: 'location' },
  { keyCode: '650', type: 'location-fill' },
  { keyCode: '64c', type: 'favor' },
  { keyCode: '64b', type: 'favor-fill' },
  { keyCode: '64a', type: 'emoji' },
  { keyCode: '649', type: 'edit' },
  { keyCode: '646', type: 'close' },
  { keyCode: '645', type: 'check' },
]

class IconExample extends PureComponent {
  render() {
    return (
      <div className="icon-example">
        {icons.map((icon, key) => (
          <div className="icon-col" key={key}>
            <Icon type={icon.type} />
            <p>{`${icon.type}`}</p>
            {`编码:&#xe${icon.keyCode}`}
          </div>
        ))}
      </div>
    )
  }
}

export default <IconExample />
