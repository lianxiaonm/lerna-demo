// 默认全局变量的兜底
window.solution = window.solution || {}
// set pkg
Object.defineProperty(solution, 'pkgInfo', {
  enumerable: true,
  value: require(process.env.PKG_PATH),
})
