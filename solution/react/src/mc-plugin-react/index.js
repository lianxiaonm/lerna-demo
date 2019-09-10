const path = require('path')

module.exports = {
  option: {
    inferno: false,
    latest: false,
    cdn: true,
    devtools: false,
  },
  apply(expand) {
    const { cdn, devtools, inferno, latest } = expand.config.react
    const isProd = process.env.NODE_ENV === 'production'

    if (inferno) {
      const infernoCompat = path.dirname(require.resolve('inferno-compat/package.json'))
      expand.addAlias({ react: infernoCompat, 'react-dom': infernoCompat })
      expand.addPolyfill(require.resolve('inferno-compat'))
    } else if (latest) {
      expand.addExternal({ react: 'React', 'react-dom': 'ReactDOM' })
      if (isProd) {
        expand.addBody([
          '<script src="https://cdn.bootcss.com/react/16.8.6/umd/react.production.min.js"></script>',
          '<script src="https://cdn.bootcss.com/react-dom/16.8.6/umd/react-dom.production.min.js"></script>',
        ])
      } else {
        expand.addBody([
          '<script src="https://cdn.bootcss.com/react/16.8.6/umd/react.development.js"></script>',
          '<script src="https://cdn.bootcss.com/react-dom/16.8.6/umd/react-dom.development.js"></script>',
        ])
      }
    } else if (cdn) {
      expand.addExternal({ react: 'React', 'react-dom': 'ReactDOM' })
      if (isProd) {
        expand.addBody([
          '<script src="https://cdn.bootcss.com/react/15.4.2/react.min.js"></script>',
          '<script src="https://cdn.bootcss.com/react-dom/15.4.2/react-dom.min.js"></script>',
        ])
      } else {
        expand.addBody([
          '<script src="https://cdn.bootcss.com/react/15.4.2/react.js"></script>',
          '<script src="https://cdn.bootcss.com/react-dom/15.4.2/react-dom.js"></script>',
        ])
      }
    } else {
      expand.addCommonEntry({
        key: 'react-lib',
        entry: ['react', 'react-dom'],
      })
    }
    expand.addPolyfill(require.resolve('prop-types'))

    if (!isProd && devtools) {
      expand.addHead(['<script src="http://localhost:8097"></script>'])
      if (inferno) expand.addRuntime(require.resolve('./runtime'))
    }
  },
}
