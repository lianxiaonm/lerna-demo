import React from 'react'
import { FlexContent } from '@mini-case/react-component'
import './style.less'

const content = '😀😀 张良（约前250—前186年），字子房，河南颍川城父（今河南宝丰）人，秦末汉初杰出的谋士、大臣，与韩信、萧何并称为“汉初三杰”张良的祖父、父亲等先辈在韩国的首都阳翟（今河南禹州）任过五代韩王之相。'

export default (
  <div className="flex-content-exmaple">
    <FlexContent content={content} line={2} />
  </div>
)
