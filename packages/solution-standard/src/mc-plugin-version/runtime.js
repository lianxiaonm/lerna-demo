import compareVersions from 'compare-versions'
import { getJSON } from '@mini-case/utils'

const { modules } = solution.config.version

Promise.all(modules.map(({ name, version }) => {
  const pkgUrl = `http://registry.npm.taobao.org/${name}/${version}`
  const curVersion = process.env.VERSION_CURRENT[name]
  return getJSON({ url: pkgUrl }).then(result => {
    const { version: newVersion } = result
    if (compareVersions(curVersion, newVersion) < 0) {
      console.warn(`${name}: 最新版本 ${newVersion}，当前版本 ${curVersion}`)
    }
  })
}))
