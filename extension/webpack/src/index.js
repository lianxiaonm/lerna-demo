module.exports = {
  extend(program) {
    program
      .command('dev')
      .description('start webpackDevServer')
      .option('--port <port>', 'webpack dev server port(8080)')
      .option('--publicPath <publicPath>', 'webpack dev server publicPath(/)')
      .option('--mode <mode>', 'mode')
      .option('--nohash', 'js/css no hash')
      .action(option => {
        require('./execute/dev')(option)
      })

    program
      .command('build')
      .description('webpack build')
      .option('--outputPath <outputPath>', 'webpack outputPath(dist)')
      .option('--publicPath <publicPath>', 'webpack publicPath')
      .option('--watch', 'webpack watch build')
      .option('--mode <mode>', 'mode')
      .option('--hash', 'js/css hash')
      .action(option => {
        require('./execute/build')(option)
      })
  },
}
