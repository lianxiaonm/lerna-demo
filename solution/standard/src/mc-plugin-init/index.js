const path = require('path')

// eslint-disable-next-line
const getScript = (config) => (
  // 暴露唯一全局变量: solution
  `<script type="text/javascript">
      window.pageStartTime = new Date().getTime()
      window.solution = { config: ${JSON.stringify(config)} }
   </script>`
)

module.exports = {
  apply(expand) {
    const { config } = expand
    expand.addEnv({
      NODE_ENV: process.env.NODE_ENV || 'development',
      PKG_PATH: path.resolve('package.json'),
      CONFIG: config,
    })
    expand.addHead(getScript(expand.config))
    expand.addRuntime(require.resolve('./runtime'))
  },
}
