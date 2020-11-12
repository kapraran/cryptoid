import { hash } from "./utils"

describe('utils', () => {
  describe('hash()', () => {
    it('returns the same hash for the same input', () => {
      const inputA = {a: 1}
      const inputB = {a: 1}

      expect(hash(inputA)).toEqual(hash(inputB))
    })

    it('returns the same hash for the same input even with different order', () => {
      expect(hash(1, 3, 2)).toEqual(hash(2, 1, 3))
    })

    it('creates a different hash even when the object reference is the same but has updated props', () => {
      const obj: {name?: string} = {}
      const hashA = hash(obj)
      obj.name = 'Nick'
      const hashB = hash(obj)

      expect(hashA).not.toEqual(hashB)
    })
  })
})