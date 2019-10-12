module.exports = {
  plugins: [
    require.resolve('./mc-plugin-require'),
  ],
  config: {
    react: { inferno: false },
    code: { barcode: true },
  },
  page: {
    index: {
      entry: './src/index',
      title: 'react component demo',
    },
  },
  dev: {
    path: '/index.html',
  },
}
