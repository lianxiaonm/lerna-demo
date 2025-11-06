import React from 'react'
import { LazyLoad } from '@mini-case/react-component'
import './style.less'

const luban = 'https://img.alicdn.com/tfs/TB1wBf4rgTqK1RjSZPhXXXfOFXa-44-44.png'
const lubanpng = 'https://oalipay-dl-django.alicdn.com/rest/1.0/image?fileIds=xXguiS10RAiyXs4vkCpLugAAACMAARAD&zoom=original'
const lubangif = 'https://gw.alipayobjects.com/zos/basement_prod/89247816-b9c8-4a1b-a0f4-977f547e2146/jose3yjs_w314_h314.gif'
const onLoad = () => console.log('loaded')
const onError = () => console.log('error')

export default (
  <div className="lazy-load-example">
    <LazyLoad image={luban} />
    <LazyLoad image={luban} mode="contain" shortSide />
    <LazyLoad image={luban} type="avatar" round />
    <LazyLoad image={luban} type="bigShop" />
    <LazyLoad image={luban} fixedWidth />
    <LazyLoad image={luban} fixedHeight />
    <LazyLoad image={luban} type="fuzzy" />
    <LazyLoad image={luban} onLoad={onLoad} />
    <LazyLoad image="asdf" onError={onError} />
    <LazyLoad scale={1} image={lubangif} onError={onError} />
    <LazyLoad image={lubanpng} onError={onError} />
  </div>
)
