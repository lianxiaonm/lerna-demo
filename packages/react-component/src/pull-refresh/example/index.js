/* eslint-disable max-len */
import React, { PureComponent } from 'react'
import { PullRefresh, LazyLoad } from '@mini-case/react-component'
import './style.less'

const zhangliang = 'https://gw.alipayobjects.com/zos/rmsportal/IfqxKhzsEZeGTCpVsNOD.jpg'

class PullRefreshExample extends PureComponent {
  state = { content: String(new Date()) }

  refresh = () => new Promise(resolve => {
    setTimeout(() => {
      this.setState({ content: String(new Date()) })
      resolve()
    }, 500)
  })

  render() {
    const { content } = this.state
    return (
      <div className="pull-refresh-example">
        <PullRefresh refresh={this.refresh}>
          <div>
            <LazyLoad image={zhangliang} type="bigShop" />
            <time>{content}</time>
            <p>
              张良（约前250—前186年），字子房，河南颍川城父（今河南宝丰）人，秦末汉初杰出的谋士、大臣，与韩信、萧何并称为“汉初三杰”。
            </p>
            <p>张良的祖父、父亲等先辈在韩国的首都阳翟（今河南禹州）任过五代韩王之相。</p>
            <p>
              曾劝刘邦在鸿门宴上卑辞言和，保存实力，并疏通项羽叔父项伯，使刘邦得以脱身。后又以出色的智谋，协助汉高祖刘邦在楚汉战争中最终夺得天下，帮助吕后扶持刘盈登上太子之位，被封为留侯。
            </p>
            <p>
              他精通黄老之道，不留恋权位，晚年据说跟随赤松子云游。张良去世后，谥为文成侯。《史记·留侯世家》专门记载了张良的生平。汉高祖刘邦在洛阳南宫评价他说：“夫运筹策帷帐之中，决胜于千里之外，吾不如子房。”表现出张良的机智谋划、文韬武略。后世敬其谋略出众，称其为“谋圣”。
            </p>
            <p>
              张良出身于贵族世家，祖父张开地，连任战国时韩国三朝的宰相。父亲张平，亦继任韩国二朝的宰相。至张良时代，韩国已逐渐衰落。韩国的灭亡，使张良失去了继承父亲事业的机会，丧失了显赫荣耀的地位，故他心存亡国亡家之恨，并把这种仇恨集中于一点——反秦。张良到东方拜见仓海君，共同制定谋杀行动计划。他弟死不葬，散尽家资，找到一个大力士，为他打制一只重达120斤的大铁锤（约合60公斤），然后差人打探秦始皇东巡行踪。按照君臣车辇规定，天子六驾，即秦始皇所乘车辇由六匹马拉车，其他大臣四匹马拉车，刺杀目标是六驾马车。
            </p>
            <p>
              前218年（秦始皇二十九年），秦始皇东巡，张良很快得知，秦始皇的巡游车队即将到达阳武县（现原阳县的东半部），于是张良指挥大力士埋伏在到阳武县的必经之地——古博浪沙。不多时，远远看到三十六辆车队由西边向博浪沙处行走过来，前面鸣锣开道，紧跟着是马队清场，黑色旌旗仪仗队走在最前面，车队两边，大小官员前呼后拥。见此情景，张良与大力士确定是秦始皇的车队到达。但所有车辇全为四驾，分不清哪一辆是秦始皇的座驾，只看到车队最中间的那辆车最豪华。于是张良指挥大力士向该车击去。120斤的大铁锤一下将乘车者击毙倒地。张良趁乱钻入芦苇丛中，逃离现场（力士是否逃生则没有任何记载）。然而，被大力士击中的只是副车，秦始皇因多次遇刺，早有预防准备，所有车辇全部四驾，时常换乘座驾，张良自然很难判断哪辆车中是秦始皇。秦始皇幸免于难，但秦始皇对此事十分恼怒，下令全国缉捕刺客，但因无从查起，使张良得以“逍遥法外”，后来不了了之。古博浪沙张良刺秦从此闻名遐迩。
            </p>
          </div>
        </PullRefresh>
      </div>
    )
  }
}

export default <PullRefreshExample />
