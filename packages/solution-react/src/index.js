const standardSolution = require('@mini-case/solution-standard')

const { plugins, extension, config, webpack } = standardSolution

// plugins
exports.plugins = [
  ...plugins,
  require.resolve('./mc-plugin-code'),
  require.resolve('./mc-plugin-imports'),
  require.resolve('./mc-plugin-react'),
]

// plugin config
exports.config = {
  ...config,
  version: {
    modules: [{
      name: '@mini-case/react-component',
      version: 'latest',
    }, {
      name: '@mini-case/utils',
      version: 'latest',
    }, {
      name: '@mini-case/solution-standard',
      version: 'latest',
    }],
    cwd: __dirname,
  },
}

// webpack config
exports.webpack = webpack

// extend commands
exports.extension = [
  ...extension,
  require.resolve('@mini-case/mc-extension-webpack'),
]
