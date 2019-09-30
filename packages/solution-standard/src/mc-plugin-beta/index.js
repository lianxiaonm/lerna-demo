const path = require('path')
const cp = require('child_process')

module.exports = {
  disable: process.env.NODE_ENV === 'production',
  option: { modules: [], tag: 'beta' },
  apply(expand) {
    const { modules, tag } = expand.config.beta
    modules.forEach(module => {
      console.info(`Download ${module}@${tag}....`.cyan)
      cp.execSync(`npm install ${module}@${tag}`, { cwd: path.resolve(__dirname, '..') })
    })
    modules.forEach(module => {
      expand.addAlias({
        [module]: path.dirname(require.resolve(`${module}/package.json`)),
      })
    })
  },
}
