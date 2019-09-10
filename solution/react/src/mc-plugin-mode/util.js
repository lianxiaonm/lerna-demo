const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

const ejsStr = new Map()

exports.renderEjs = (options, { outputDir, filename }, template) => {
  let str = ejsStr.get(template)
  if (!str) {
    str = fs.readFileSync(path.join(__dirname, template)).toString()
    ejsStr.set(template, str)
  }
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)
  const filePath = path.join(__dirname, outputDir, `${filename}.js`)
  fs.writeFileSync(filePath, ejs.render(str, options))
}
