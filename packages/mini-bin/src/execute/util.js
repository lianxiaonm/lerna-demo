const path = require('path')
const os = require('os')
const zlib = require('zlib')
const inquirer = require('inquirer')
const tarfs = require('tar-fs')
const vfs = require('vinyl-fs')
const map = require('map-stream')
const rimraf = require('rimraf')
const writeJsonFile = require('write-json-file')

const { solutions } = require('../solution')

const { request } = global

exports.getSolutionConfig = async () => {
  const sconfig = {}
  const choiceTree = {}
  solutions.forEach(({ solution, cate, title, show, boilerplate }) => {
    // 没有配置 title 不显示的解决方案
    if (!title || !show) return
    // 对解决方案分类处理
    if (cate === 'solution') {
      choiceTree[title] = boilerplate
      sconfig[title] = { solution, boilerplate }
    }
  })
  return { sconfig, choiceTree }
}

exports.getSolution = async choiceTree => {
  const { solution } = await inquirer.prompt([{
    type: 'list',
    name: 'solution',
    message: '请选择解决方案(Please select a solution):',
    choices: Object.keys(choiceTree),
  }])
  // 不含子解决方案
  if (typeof choiceTree[solution] === 'string') return solution
  throw new Error('solution config error')
}

exports.getPkgInfo = () => {
  const validate = input => !!input
  const name = process.cwd().split('/').pop()
  return inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'name: ',
    default: name,
    validate,
  }, {
    type: 'input',
    name: 'description',
    message: 'description: ',
    default: `${name} description`,
    validate,
  }, {
    type: 'input',
    name: 'author',
    message: 'author: ',
    validate,
  }, {
    type: 'input',
    name: 'repository',
    message: 'repository(git url): ',
  }])
}

exports.getBoilerplate = async (pkg, tag) => {
  const pkgUrl = `http://registry.npm.taobao.org/${pkg}/${tag}`
  const body = await request.get(pkgUrl).json()
  const response = await request.get(body.dist.tarball)

  const dest = path.resolve(os.tmpdir(), pkg)
  return new Promise(resolve => {
    const boilerplatePath = path.resolve(dest, 'package')
    response.body
      .pipe(zlib.createGunzip())
      .pipe(tarfs.extract(dest))
      .on('finish', () => resolve(boilerplatePath))
  })
}

exports.writeBoilerplate = (boilerplatePath, pkgInfo) => {
  const rewriteDotFiles = (file, cb) => {
    file.path = file.path.replace(/_(\.\w+)$/, '$1') // eslint-disable-line no-param-reassign
    cb(null, file)
  }

  const updatePkg = () => {
    const { name, description, author, repository, solution } = pkgInfo
    const pkgJsonPath = path.resolve('package.json')
    const pkgJSon = require(pkgJsonPath)
    const { dependencies } = pkgJSon
    pkgJSon.solution = solution
    pkgJSon.name = name
    pkgJSon.description = description
    pkgJSon.author = author
    pkgJSon.version = '1.0.0'
    pkgJSon.repository = pkgJSon.repository || {}
    pkgJSon.repository.type = 'git'
    pkgJSon.repository.url = repository
    pkgJSon.dependencies = { ...dependencies, [solution]: 'latest' }
    return writeJsonFile.sync(pkgJsonPath, pkgJSon, { detectIndent: true })
  }

  return new Promise(resolve => {
    vfs
      .src('**/*', { cwd: boilerplatePath, dot: true })
      .pipe(map(rewriteDotFiles))
      .pipe(vfs.dest(process.cwd()))
      .on('finish', () => {
        updatePkg()
        rimraf.sync(boilerplatePath)
        resolve()
      })
  })
}
