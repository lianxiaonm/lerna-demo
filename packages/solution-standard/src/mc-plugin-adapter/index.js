const safeAreaInset = require('postcss-safe-area-inset')
const pxtorem = require('postcss-pxtorem')

// 自适应屏幕 + 高清方案
const getScript = (adapter) => (
  `<script type="text/javascript">
    +function(a){
      var b=a.baseFontSize,c=b===void 0?100:b,d=a.isScale,f=a.viewportFit,g=f===void 0?'cover':f,h=a.pcAdapter,j=document.documentElement,k=navigator.userAgent,l=k.match(/Android[\\S\\s]+AppleWebkit\\/(\\d{3})/i),m=k.match(/U3\\/((\\d+|\\.){5,})/i),n=m&&80<=parseInt(m[1].split('.').join(''),10),o=navigator.appVersion.match(/(iphone|ipad|ipod)/gi),p=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(k),q=1;if(!(d!==void 0)||d){var t=window.devicePixelRatio||1;o||l&&534<l[1]||n||(t=1),q=1/t,1>q?j.setAttribute('data-scale',q):j.removeAttribute('data-scale')}else j.removeAttribute('data-scale');var r=document.querySelector('meta[name="viewport"]');r||(r=document.createElement('meta'),r.setAttribute('name','viewport'),document.head.appendChild(r)),r.setAttribute('content','width=device-width,user-scalable=no,initial-scale='+q+',maximum-scale='+q+',minimum-scale='+q+',viewport-fit='+g);var s=function refreshRem(){var t=j.getBoundingClientRect(),u=t.width;h!==void 0&&h&&!p&&750<u&&(u=750);var v=u/750*c;j.style.fontSize=v+'px'};window.addEventListener('orientationchange',function(){return setTimeout(s,100)}),s()
    }(${JSON.stringify(adapter)});
  </script>`
)


module.exports = {
  option: { scale: true, viewportFit: 'cover', pcAdapter: true },
  apply(expand) {
    const { scale: isScale, viewportFit } = expand.config.adapter
    const scale = isScale ? '0.1' : '1.0'
    expand.addHead(`<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, viewport-fit=${viewportFit}" />`)
    if (isScale) expand.addPostcssPlugin(safeAreaInset())
    expand.addPostcssPlugin(pxtorem({
      rootValue: 100,
      propList: ['*'],
      minPixelValue: 3,
    }))
    expand.addHead(getScript(expand.config.adapter))
    expand.addRuntime(require.resolve('./runtime'))
  },
}
