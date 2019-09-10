import { deviceDetection } from '@mini-case/utils'

import '../style/normalize.less'

const deviceInfo = deviceDetection()
if (deviceInfo.device) {
  document.documentElement.setAttribute('data-device', deviceInfo.device)
}
Object.defineProperty(solution, 'deviceInfo', { enumerable: true, value: deviceInfo })
