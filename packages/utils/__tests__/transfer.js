import { immutable, lodashGet, serialize, deserialize, guid, uuid, dateFormat } from '../src/transfer'

describe('transfer', () => {
  it('should lodash get', () => {
    const baseObject = { a: { b: 1 }, c: { d: { e: 1 } } }
    const a = lodashGet(['a'], baseObject)
    const d = lodashGet(['c', 'd'], baseObject)
    const f = lodashGet(['c', 'd', 'f'], baseObject)
    expect(a.b).toBe(1)
    expect(d.e).toBe(1)
    expect(f).toStrictEqual({ })
  })

  it('should immutable', () => {
    const baseObject = { a: { b: 1 }, c: { d: { e: 1 } } }
    const res = immutable(baseObject, { 'a.b': 2 })
    expect(res.c).toBe(baseObject.c)
    expect(res.a.b).toBe(2)
  })

  it('should serialize deserialize', () => {
    const res = serialize({ a: 1, b: 2 }, '^')
    expect(res).toBe('a=1^b=2')
    const res2 = deserialize(res, '^')
    expect(+res2.a).toBe(1)
  })

  it('should guid uuid', () => {
    expect(guid()).not.toBe(guid())
    expect(uuid(10)).not.toBe(uuid(10))
    expect(uuid(10).length).toBe(10)
  })

  it('should DateFormat', () => {
    const date = dateFormat(new Date(), 'yyyy-MM-dd')
    expect(date).toBe('2020-06-11')
    const date1 = dateFormat(new Date(), 'yyyy-MM-dd hh')
    expect(date1).toBe('2020-06-11 20')
  })
})
