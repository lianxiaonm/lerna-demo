import type from './type'

export const browser = !!(typeof window !== 'undefined' && window.document)

// type
export const checkType = type

// extend
export { valueFn, NO_OP, trim, includes, toArr, toJson, fromJson, toMap, hashCode, uuid, guid, equals } from './extend'

// dom
export { isInViewport, px2PX, rem2PX, dp2PX, PX2dp, passiveSupported, featureSupport, easeOut, scrollBy } from './dom'

// image
export { getZoom, getImage, webpFeautre } from './image'

// device
export { version2Float, deviceDetection } from './device'

// request
export { getJSON, loadScript, jsonp } from './request'

// other
export { throttle, debounce } from './other'

// usual
export { getParam, paramStr, buildUrl, dateFormat } from './usual'

// cookies
export { createCookie, readCookie, eraseCookie } from './cookie'
