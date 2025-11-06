import checkType, { getType } from '../src/type'

describe('checkType', () => {
  it('should getType', () => {
    expect(getType('')).toBe('string')
    expect(getType([])).toBe('array')
    expect(getType(new Date())).toBe('date')
    expect(getType(() => false)).toBe('function')
  })
  it('should checkType', () => {
    expect(checkType.isUndef()).toBe(true)
    expect(checkType.isUndef(null)).toBe(false)
    expect(checkType.isNull(null)).toBe(true)
    expect(checkType.isNull(1)).toBe(false)
    expect(checkType.isFunc(() => 1)).toBe(true)
    expect(checkType.isFunc(1)).toBe(false)
    expect(checkType.isBoolean(true)).toBe(true)
    expect(checkType.isBoolean(1)).toBe(false)
    expect(checkType.isDate(new Date())).toBe(true)
    expect(checkType.isDate(1)).toBe(false)
    expect(checkType.isEmpty({})).toBe(true)
    expect(checkType.isEmpty({ a: 1 })).toBe(false)
  })
})
