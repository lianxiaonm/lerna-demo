const program = require('commander')
const Fetch = require('fetch.io')
const compareVersions = require('compare-versions')
const { name, version } = require('../package')

const request = new Fetch({
  afterResponse(response) {
    const { status, statusText } = response
    if (status >= 200 && status < 300) return response
    const err = new Error(statusText)
    err.response = response
    throw err
  },
})

global.request = request

process.on('unhandledRejection', reason => {
  if (reason) {
    if (reason instanceof Error) {
      const { message, code = 1 } = reason
      console.error(message.red)
      process.exit(code)
    } else {
      process.exit(1)
    }
  }
})

const checkVersion = async () => {
  try {
    const pkgUrl = `http://registry.npm.taobao.org/${name}/latest`
    const { version: newVersion } = await request.get(pkgUrl).json()
    if (compareVersions(version, newVersion) < 0) {
      console.warn(`@mini-case/bin: 最新版本 ${newVersion}，当前版本 ${version}`.yellow)
    }
  } catch (err) {
    // eslint-disable-line no-empty
  }
}

module.exports = async () => {
  await checkVersion()

  const extensions = require('../src/core/extension')
  // extend commands
  extensions.forEach(extension => require(extension).extend(program))

  program
    .command('init')
    .description('init mini case repo')
    .option('--solution <solution>', 'init solution')
    .option('--tag <tag>', 'tag version')
    .action(option => {
      require('../src/execute')(option)
    })
  program
    .version(version, '-v, --version')
    .parse(process.argv)
}
