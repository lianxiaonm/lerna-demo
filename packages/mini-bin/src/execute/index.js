const {
  getSolutionConfig, getSolution, getPkgInfo,
  getBoilerplate, writeBoilerplate,
} = require('./util')

module.exports = async option => {
  try {
    const { solution: assignedSolution, tag = 'latest' } = option || {}
    const { sconfig, choiceTree } = await getSolutionConfig()
    const solution = assignedSolution || await getSolution(choiceTree)
    const pkgInfo = await getPkgInfo()
    //
    const { boilerplate, ...$pkgInfo } = sconfig[solution]
    if (!boilerplate) throw new Error(`${solution} not found!`)
    const boilerplatePath = await getBoilerplate(boilerplate, tag)
    await writeBoilerplate(boilerplatePath, { ...$pkgInfo, ...pkgInfo })
    console.info('init boilerplate success!'.cyan)
  } catch (err) {
    console.error(err.message.red)
    process.exit(1)
  }
}
