import { hashData } from './utils'

describe('utils', () => {
  describe('hashData()', () => {
    it('returns the same hash for the same input', () => {
      const inputA = { a: 1 }
      const inputB = { a: 1 }

      expect(hashData(inputA)).toEqual(hashData(inputB))
    })

    it('returns the same hash for the same input even with different order', () => {
      expect(hashData(1, 3, 2)).toEqual(hashData(2, 1, 3))
    })

    it('creates a different hash even when the object reference is the same but has updated props', () => {
      const obj: { name?: string } = {}
      const hashA = hashData(obj)
      obj.name = 'Nick'
      const hashB = hashData(obj)

      expect(hashA).not.toEqual(hashB)
    })
  })
})
