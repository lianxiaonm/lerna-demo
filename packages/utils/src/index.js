export const browser = !!(typeof window !== 'undefined' && window.document)

// type
export { default as checkType } from './type'

// extend
export { valueFn, NO_OP, trim, includes, toArr, toMap, toJson, fromJson, assignTo, equals } from './extend'

// transfer
export { lodashGet, immutable, serialize, deserialize, hashCode, uuid, guid, dateFormat, buildUrl } from './transfer'

// image
export { getZoom, webpFeautre, checkWebp, getImage, loadImage } from './image'

// device
export { version2Float, deviceDetection } from './device'

// cookies
export { parseCookie, createCookie, readCookie, eraseCookie } from './cookie'

// other
export { throttle, debounce } from './other'

// request
export { getJSON, jsonp, loadScript } from './request'

// dom
export { getParam, isInViewport, rem2PX, px2PX, dp2PX, PX2dp, passiveSupported, featureSupport, easeOut, scrollBy } from './dom'
