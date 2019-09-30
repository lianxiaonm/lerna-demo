const { alias } = require('../config/webpack')

module.exports = () => ({
  extensions: ['.js', '.json', '.ts', '.tsx'],
  alias: { ...alias },
})
