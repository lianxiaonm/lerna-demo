### mc-extension-webpack 

#### 注意
> webpack 3.0 升级4.0指南 -- 等webpack 4了解透彻之后升级

* 下载的node module
```npm
cnpm i --save mini-css-extract-plugin
cnpm i --save optimize-css-assets-webpack-plugin
cnpm i --save webpack@4
cnpm i --save webpack-dev-server@3
cnpm i --save webpack-mild-compile@3
cnpm i --save css-loader@2
```

```javascript
process.env.NODE_ENV = 'production' | 'development'
// webpack 4 关键字段
process.env.mode = 'production' | 'development'
```

* webpack 4的新配置项
```javascript
const optimizeCss = require('optimize-css-assets-webpack-plugin');
module.exports= options => {
  return {
    optimization: {
      // minimize: true,
      minimizer: [new optimizeCss({})],
    }
  }
}
```

* webpack plugin的配置
```javascript
// 抽离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')

new MiniCssExtractPlugin({ filename: `${filename}.css` })
// 压缩css
new OptimizeCssPlugin({
  assetNameRegExp: /\.style\.css\.less$/g,
  cssProcessor: require('cssnano'),
  cssProcessorOptions: { discardComments: { removeAll: true } },
  canPrint: true,
})
```

* webpack rules的配置
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 
const oneLoader = !inline ? {
  loader: MiniCssExtractPlugin.loader,
} : {
  loader: require.resolve('style-loader'),
  options: {
    // ensure hot css loads before js
    sourceMap, singleton: true,
  },
}
```

