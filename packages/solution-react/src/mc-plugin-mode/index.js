
module.exports = {
  option: {
    modeType: 'spa',
    history: 'hash',
  },
  apply(expand) {
    const { modeType } = expand.config.mode
    if (modeType === 'spa') {
      // todo
    } else if (modeType === 'dva') {
      // todo
    }
  },
}
