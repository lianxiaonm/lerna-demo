const path = require('path')
// const cp = require('child_process')
const portfinder = require('portfinder')

const isEmpty = x => [null, undefined].indexOf(x) !== -1

function encodeUrl({ url, query }) {
  const search = Object
    .keys(query)
    .filter(key => !isEmpty(query[key]))
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&')
  if (!search) return url
  return url.indexOf('?') !== -1 ? `${url}&${search}` : `${url}?${search}`
}

exports.buildCallback = (err, stats) => {
  // 编译错误不在 err 对象内，而是需要使用 stats.hasErrors() 单独处理
  // err 对象只会包含 webpack 相关的问题，比如配置错误等
  if (err) {
    console.error(`\n${err.message}`.red)
    process.exit(1)
  }

  stats.stats.forEach(stat => {
    // eslint-disable-next-line no-param-reassign
    stat.compilation.children = stat.compilation.children.filter(child => !child.name)
  })

  console.info(stats.toString({
    colors: true,
    hash: false,
    modules: false,
    timings: false,
  }))
}

exports.log = (err, stdout) => {
  if (err) {
    const { message, code = 1 } = err
    console.error(message.red)
    process.exit(code)
  } else if (stdout) {
    console.info(stdout.cyan)
  }
}

exports.getPort = async port => {
  portfinder.basePort = +port
  const validPort = await portfinder.getPortPromise()
  return validPort
}

exports.openUrl = (port, publicPath) => {
  const {
    hostname = 'localhost',
    path: devPath = '/index.html',
    query = {},
  } = require('../config/dev')

  const url = encodeUrl({
    url: `http://${hostname}:${port}${path.join(publicPath, devPath)}`,
    query,
  })
  // const child = cp.spawn('open', [url])
  // child.on('exit', () => {
  console.info('\n-------------------------------'.rainbow)
  console.info(`URL: ${url}`.cyan)
  console.info('-------------------------------\n'.rainbow)
  // })
}
