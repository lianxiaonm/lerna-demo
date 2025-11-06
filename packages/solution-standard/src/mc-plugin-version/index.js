const path = require('path')
const resolve = require('resolve')

module.exports = {
  disable: process.env.NODE_ENV === 'production',
  option: {
    modules: [],
    cwd: process.cwd(),
  },
  apply(expand) {
    const { modules, cwd } = expand.config.version
    const curVersion = {}
    modules.forEach(({ name }) => {
      const pkgPath = path.resolve(resolve.sync(`${name}/package.json`, { basedir: cwd }))
      curVersion[name] = require(pkgPath).version
    })
    expand.addEnv({ VERSION_CURRENT: curVersion })
    expand.addRuntime(require.resolve('./runtime'))
  },
}
