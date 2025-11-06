import { resolve } from 'path'
import consola from 'consola'
import spawn from 'cross-spawn'
import { existsSync, readJSONSync } from 'fs-extra'
import { glob as _glob } from 'glob'
import pify from 'pify'

const DEFAULTS = {
  rootDir: process.cwd(),
  pkgPath: 'package.json',
  configPath: 'package.js',
  distDir: 'dist',
  build: false,
  suffix: process.env.PACKAGE_SUFFIX ? `-${process.env.PACKAGE_SUFFIX}` : '',
  hooks: {},
}

const glob = pify(_glob)

export default class Package {
  constructor(options) {
    // Assign options
    this.options = { ...DEFAULTS, ...options }

    // Basic logger
    this.logger = consola

    // Init (sync)
    this.$init()
  }

  $init() {
    // Try to read package.json
    this.readPkg()

    // Use tagged logger
    this.logger = consola.withTag(this.pkg.name)

    // Try to load config
    this.loadConfig()
  }

  resolvePath(...args) {
    return resolve(this.options.rootDir, ...args)
  }

  readPkg() {
    this.pkg = readJSONSync(this.resolvePath(this.options.pkgPath))
  }

  loadConfig() {
    const configPath = this.resolvePath(this.options.configPath)

    if (existsSync(configPath)) {
      let config = require(configPath)
      config = config.default || config

      Object.assign(this.options, config)
    }
  }

  load(relativePath, opts) {
    return new Package({
      rootDir: this.resolvePath(relativePath),
      ...opts,
    })
  }

  generateVersion() {
    const date = Math.round(Date.now() / (1000 * 60))
    const gitCommit = this.gitShortCommit()
    const baseVersion = this.pkg.version.split('-')[0]
    this.pkg.version = `${baseVersion}-${date}.${gitCommit}`
  }

  async getWorkspacePackages() {
    const packages = []

    // eslint-disable-next-line no-restricted-syntax
    for (const workspace of this.pkg.workspaces || []) {
      // eslint-disable-next-line no-await-in-loop
      const dirs = await glob(workspace)
      // eslint-disable-next-line no-restricted-syntax
      for (const dir of dirs) {
        if (existsSync(this.resolvePath(dir, 'package.json'))) {
          const pkg = new Package({ rootDir: this.resolvePath(dir) })
          packages.push(pkg)
        } else {
          consola.warn('Invalid workspace package:', dir)
        }
      }
    }

    return packages
  }

  exec(command, args, silent = false) {
    const r = spawn.sync(
      command,
      args.split(' '),
      { cwd: this.options.rootDir },
      { env: process.env },
    )

    if (!silent) {
      const fullCommand = `${command} ${args}`
      if (r.error) {
        this.logger.error(fullCommand, r.error)
      } else {
        this.logger.success(fullCommand, r.output)
      }
    }

    return {
      error: r.error,
      pid: r.pid,
      status: r.status,
      signal: r.signal,
      stdout: String(r.stdout).trim(),
      stderr: String(r.stderr).trim(),
      output: (r.output || [])
        .map(l => String(l).trim())
        .filter(l => l.length)
        .join('\n'),
    }
  }

  build() {
    this.logger.info(`yarn build ${this.pkg.name}@${this.pkg.version} with bundle`)
    this.exec('yarn', 'build')
  }

  publish(tag = 'latest') {
    this.logger.info(`publishing ${this.pkg.name}@${this.pkg.version} with tag ${tag}`)
    this.exec('npm', `publish --tag ${tag}`)
  }

  gitShortCommit() {
    const { stdout } = this.exec('git', 'rev-parse --short HEAD', true)
    return stdout
  }

  gitBranch() {
    const { stdout } = this.exec('git', 'rev-parse --abbrev-ref HEAD', true)
    return stdout
  }
}
