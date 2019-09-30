const TRANSLATE32 = 'translate(32,32)'
const STROKE_OPACITY = 'stroke-opacity'
const ROUND = 'round'
const INDEFINITE = 'indefinite'
const DURATION = '750ms'
const NONE = 'none'
const SHORTCUTS = {
  a: 'animate',
  an: 'attributeName',
  at: 'animateTransform',
  c: 'circle',
  da: 'stroke-dasharray',
  os: 'stroke-dashoffset',
  f: 'fill',
  lc: 'stroke-linecap',
  rc: 'repeatCount',
  sw: 'stroke-width',
  t: 'transform',
  v: 'values',
}
const SPIN_ANIMATION = {
  v: '0,32,32;360,32,32',
  an: 'transform',
  type: 'rotate',
  rc: INDEFINITE,
  dur: DURATION,
}


function setSvgAttribute(ele, k, v) {
  ele.setAttribute(SHORTCUTS[k] || k, v)
}


function animationValues(strValues, i) {
  let values = strValues.split(';')
  const back = values.slice(i)
  const front = values.slice(0, values.length - back.length)
  values = back.concat(front).reverse()
  return `${values.join(';')};${values[0]}`
}


const IOS_SPINNER = {
  sw: 4,
  lc: ROUND,
  line: [{
    fn(i, spinnerName) {
      return {
        y1: spinnerName === 'ios' ? 18 : 13,
        y2: spinnerName === 'ios' ? 29 : 20,
        t: `${TRANSLATE32} rotate(${30 * i + (i < 6 ? 180 : -180)})`,
        a: [{
          fn() {
            return {
              an: STROKE_OPACITY, dur: DURATION, rc: INDEFINITE,
              v: animationValues('0;.1;.15;.25;.35;.45;.55;.65;.7;.85;1', i),
            }
          },
          t: 1,
        }],
      }
    },
    t: 12,
  }],
}

export const spinners = {
  ios: IOS_SPINNER,
  'ios-small': IOS_SPINNER,
  bubbles: {
    sw: 0,
    c: [{
      fn(i) {
        return {
          cx: 24 * Math.cos(2 * Math.PI * i / 8),
          cy: 24 * Math.sin(2 * Math.PI * i / 8),
          t: TRANSLATE32,
          a: [{
            fn() {
              return {
                an: 'r', dur: DURATION, rc: INDEFINITE,
                v: animationValues('1;1.5;2;2.5;3;3.5;4;4.8', i),
              }
            },
            t: 1,
          }],
        }
      },
      t: 8,
    }],
  },
  circles: {
    c: [{
      fn(i) {
        return {
          r: 5,
          cx: 24 * Math.cos(2 * Math.PI * i / 8),
          cy: 24 * Math.sin(2 * Math.PI * i / 8),
          t: TRANSLATE32,
          sw: 0,
          a: [{
            fn() {
              return {
                an: 'fill-opacity', dur: DURATION, rc: INDEFINITE,
                v: animationValues('.3;.3;.3;.4;.7;.85;.9;1', i),
              }
            },
            t: 1,
          }],
        }
      },
      t: 8,
    }],
  },
  crescent: {
    c: [{
      sw: 4, da: 128, os: 82, r: 26, cx: 32, cy: 32,
      f: NONE, at: [SPIN_ANIMATION],
    }],
  },
  dots: {
    c: [{
      fn(i) {
        return {
          cx: 16 + (16 * i),
          cy: 32, sw: 0,
          a: [{
            fn() {
              return {
                an: 'fill-opacity', dur: DURATION, rc: INDEFINITE,
                v: animationValues('.5;.6;.8;1;.8;.6;.5', i),
              }
            },
            t: 1,
          }, {
            fn() {
              return {
                an: 'r', dur: DURATION, rc: INDEFINITE,
                v: animationValues('4;5;6;5;4;3;3', i),
              }
            },
            t: 1,
          }],
        }
      },
      t: 3,
    }],
  },
  lines: {
    sw: 7,
    lc: ROUND,
    line: [{
      fn(i) {
        return {
          x1: 10 + (i * 14),
          x2: 10 + (i * 14),
          a: [{
            fn() {
              return {
                an: 'y1', dur: DURATION, rc: INDEFINITE,
                v: animationValues('16;18;28;18;16', i),
              }
            },
            t: 1,
          }, {
            fn() {
              return {
                an: 'y2', dur: DURATION, rc: INDEFINITE,
                v: animationValues('48;44;36;46;48', i),
              }
            },
            t: 1,
          }, {
            fn() {
              return {
                an: STROKE_OPACITY, dur: DURATION, rc: INDEFINITE,
                v: animationValues('1;.8;.5;.4;1', i),
              }
            },
            t: 1,
          }],
        }
      },
      t: 4,
    }],
  },
  ripple: {
    f: NONE,
    'fill-rule': 'evenodd',
    sw: 3,
    circle: [{
      fn(i) {
        return {
          cx: 32, cy: 32,
          a: [{
            fn() {
              return {
                an: 'r',
                begin: `${i * -1}s`,
                dur: '2s',
                v: '0;24',
                keyTimes: '0;1',
                keySplines: '0.1,0.2,0.3,1',
                calcMode: 'spline',
                rc: INDEFINITE,
              }
            },
            t: 1,
          }, {
            fn() {
              return {
                an: STROKE_OPACITY, begin: `${i * -1}s`, dur: '2s',
                v: '.2;1;.2;0', rc: INDEFINITE,
              }
            },
            t: 1,
          }],
        }
      },
      t: 2,
    }],
  },
  spiral: {
    defs: [{
      linearGradient: [{
        id: 'sGD',
        gradientUnits: 'userSpaceOnUse',
        x1: 55,
        y1: 46,
        x2: 2,
        y2: 46,
        stop: [{
          offset: 0.1, class: 'stop1',
        }, {
          offset: 1, class: 'stop2',
        }],
      }],
    }],
    g: [{
      sw: 4,
      lc: ROUND,
      f: NONE,
      path: [{
        stroke: 'url(#sGD)', d: 'M4,32 c0,15,12,28,28,28c8,0,16-4,21-9',
      }, {
        d: 'M60,32 C60,16,47.464,4,32,4S4,16,4,32',
      }],
      at: [SPIN_ANIMATION],
    }],
  },
}

export function createSvgElement(tagName, data, parent, spinnerName) {
  const ele = document.createElement(SHORTCUTS[tagName] || tagName)
  Object.keys(data).forEach(key => {
    const $data = data[key]
    if ($data instanceof Array) {
      $data.forEach(dataX => {
        const { fn, t } = dataX
        if (fn) {
          for (let y = 0; y < t; y++) {
            createSvgElement(key, dataX.fn(y, spinnerName), ele, spinnerName)
          }
        } else createSvgElement(key, dataX, ele, spinnerName)
      })
    } else setSvgAttribute(ele, key, $data)
  })
  parent.appendChild(ele)
}
