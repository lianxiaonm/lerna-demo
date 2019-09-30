
export function version2Float(version) {
  const versionArr = version.split('.')
  const major = parseInt(versionArr[0] || 0, 10)
  let minor = parseInt(versionArr[1] || 0, 10)
  let patch = parseInt(versionArr[2] || 0, 10)
  if (minor < 10) minor = `0${minor}`
  if (patch < 10) patch = `0${patch}`
  return parseFloat(`${major}.${minor}${patch}`)
}

export function deviceDetection() {
  const ua = navigator.userAgent
  let osVersion = ''
  let device = ''
  try {
    if (/android/i.test(ua)) {
      device = 'android'
      osVersion = ua.match(/Android\s+([\d.]+)/i)[0].replace('Android ', '')
    } else if (/ipad|iphone|ipod/i.test(ua)) {
      device = 'ios'
      osVersion = ua.match(/OS\s+([\d_]+)/i)[0].replace(/_/g, '.').replace('OS ', '')
    }
  } catch (err) {
    /* istanbul ignore next line */
    console.error(err)
  }
  return { osVersion, device }
}
