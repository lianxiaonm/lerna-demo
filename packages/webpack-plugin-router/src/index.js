const path = require('path')
const fs = require('fs')

class RouteOutPlugin {
  constructor(options) {
    this.options = options || {}
    this.routes = { }
  }

  analyzerModuleId(compiler, module, options) {
    const { prefix, entry, entryKeys } = options
    const { context } = compiler.options
    const { id: $chunkName } = module
    if ($chunkName !== null) {
      const id = module.libIdent({ context })
      entryKeys.every(key => {
        const { modules, path: $path } = entry[key] || { }
        if ((modules || []).indexOf(id) > -1) {
          this.routes[$path] = { source: [path.join(prefix, `${key}.js`)], $chunkName }
          return false
        }
        return true
      })
    }
  }

  apply(compiler) {
    const {
      entry = { },
      publicPath = '/',
      urlPrefix = 'http://localhost:',
      port = 80,
    } = this.options
    const entryKeys = Object.keys(entry)
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('module-ids', (modules) => {
        modules.forEach((module) => {
          this.analyzerModuleId(compiler, module, {
            entry, entryKeys,
            prefix: `${urlPrefix}${port}${publicPath}`,
          })
        })
      })
    })

    compiler.plugin('done', () => {
      const {
        outFile = path.join(process.cwd(), 'router.json'),
      } = this.options
      const nextRoutes = Object.keys(this.routes)
        .reduce((rout, next) => (
          [...rout, { path: next, ...this.routes[next] }]
        ), [])
      fs.writeFileSync(outFile, JSON.stringify(nextRoutes))
      console.info('\n', nextRoutes)
    })
  }
}

module.exports = RouteOutPlugin
