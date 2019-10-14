const path = require('path')

module.exports = {
  disable: process.env.$MOD !== 'mock',
  option: { entry: './mock/index.js' },
  apply(expand) {
    const { entry } = expand.config.mock
    expand.addEnv({
      MOCK_ENTRY: path.resolve(entry),
    })
    expand.addRuntime(require.resolve('./runtime'))
  },
}
