const path = require('path')

const baseComponents = ['@mini-case/react-component']
const baseModules = []

module.exports = {
  option: { },
  apply(expand) {
    const { components = [], modules = [] } = expand.config.imports
    const componentSet = [...new Set(baseComponents.concat(components))]
    const moduleSet = [...new Set(baseModules.concat(modules))]
    componentSet.forEach(libraryName => {
      expand.addAlias({
        [`${libraryName}/lib`]: path.dirname(require.resolve(`${libraryName}/es`)),
        [`${libraryName}/es`]: path.dirname(require.resolve(`${libraryName}/es`)),
      })
      expand.addBabelPlugin([
        [require.resolve('babel-plugin-import'), { libraryName }, libraryName],
      ])
    })
    moduleSet.forEach(libraryName => {
      expand.addAlias({
        [`${libraryName}`]: path.dirname(require.resolve(`${libraryName}/package.json`)),
      })
    })
  },
}
