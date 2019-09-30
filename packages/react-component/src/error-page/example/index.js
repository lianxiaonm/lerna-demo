import React from 'react'
import { ErrorPage } from '@mini-case/react-component'

const reload = () => new Promise(resolve => {
  setTimeout(resolve, 2000)
})

export default (
  <div className="error-page-example">
    <ErrorPage type="error" />
    <ErrorPage type="no-network" />
    <ErrorPage type="page-result-limiting" />
    <ErrorPage reload={reload} btn="刷新刷新刷新刷新刷新" type="error" />
    <ErrorPage subTitle="😁😁😁😁😀" reload={reload} type="no-network" />
    <ErrorPage reload={reload} btn="刷新刷新刷新刷新刷新" type="page-result-limiting" />
    <ErrorPage icon="https://a.alipayobjects.com/g/antui/antui-img/1.0.0/page-result/404.png"
      iconHeight="2.8rem"
      title="🙃🙃"
      reload={reload} />
  </div>
)
