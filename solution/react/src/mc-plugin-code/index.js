
module.exports = {
  options: {
    barcode: true,
    qrcode: true,
  },
  apply(expand) {
    const { barcode, qrcode } = expand.config.code
    const isProd = process.env.NODE_ENV === 'production'
    const codeEntry = []
    if (barcode) codeEntry.push('jsbarcode')
    if (qrcode || !isProd) codeEntry.push('qrcode')
    if (codeEntry && codeEntry.length) {
      expand.addCommonEntry({ key: 'code-lib', entry: codeEntry })
    }
    if (!isProd) expand.addRuntime(require.resolve('./runtime'))
  },
}
