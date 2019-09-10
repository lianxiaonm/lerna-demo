const env = process.env.NODE_ENV || 'development'

module.exports = (context, opts = {}) => {
  const { modules = 'commonjs', browsers = ['iOS >= 6.0', 'Android >= 4.0'] } = opts

  const presets = [require.resolve('@babel/preset-react')]

  const plugins = [
    // runtime
    '@babel/plugin-transform-runtime',

    // Stage 0
    '@babel/plugin-proposal-function-bind',

    // Stage 1
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-logical-assignment-operators',
    ['@babel/plugin-proposal-optional-chaining', { loose: false }],
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
    '@babel/plugin-proposal-do-expressions',

    // Stage 2
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',

    // Stage 3
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    '@babel/plugin-proposal-json-strings',
  ]

  if (env === 'test') {
    presets.unshift([require.resolve('@babel/preset-env'), {
      targets: { node: '9.0.0' },
    }])
  } else {
    presets.unshift([require.resolve('@babel/preset-env'), {
      targets: { browsers },
      modules,
    }])
  }

  return { presets, plugins }
}
