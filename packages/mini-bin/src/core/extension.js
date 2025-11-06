const path = require('path')
const cp = require('child_process')
const { resolveCwd, safeRequire } = require('../utils')

const { solution, extension: appExtensions = [] } = safeRequire(path.resolve('package.json'))

const { extension: soluExtensions = [] } = solution ? safeRequire(resolveCwd(solution)) : {}


const initExtensions = [...soluExtensions, ...appExtensions]
const extensionMap = new Map()

initExtensions.forEach(extension => {
  const beta = /@beta$/.test(extension || '')
  if (beta) {
    // 支持 beta 验证自动安装
    console.info(`Download ${extension}....`.cyan)
    cp.execSync(`npm install ${extension}`)
  }
  const extensionPath = beta ? resolveCwd(extension.slice(0, -5)) : resolveCwd(extension)
  const res = /mc-extension-([\w-]+)(\/|\\)/.exec(extensionPath)
  const extensionName = res && res[1]
  if (extensionName) extensionMap.set(extensionName, extensionPath)
})
const extensions = [...extensionMap.values()]

module.exports = extensions
