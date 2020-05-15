import { lodashGet } from '../src/transfer'

describe('lodashGet', () => {
  it('lodash get array', () => {
    const res = lodashGet(['a'], { a: { b: 1 } })
    expect(res.b).toBe(1)
  })
})
