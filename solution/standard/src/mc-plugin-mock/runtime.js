const mock = require(process.env.MOCK_ENTRY)

Object.defineProperty(solution, 'mock', {
  enumerable: true,
  value: mock.default ? mock.default : mock,
})
