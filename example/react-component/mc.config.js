module.exports = {
  plugins: [],
  config: {
    react: { inferno: false, latest: true },
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
