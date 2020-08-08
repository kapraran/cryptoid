import { Block } from '../lib/block'
import { hashBlockData } from '../lib/utils'
import faker from 'faker'

faker.seed(1911)

describe('Block', () => {
  it('create an instance of block', () => {
    const data = faker.name.firstName()
    const timestamp = Date.now()
    const hash = faker.random.alphaNumeric(64)
    const prevHash = faker.random.alphaNumeric(64)
    const difficulty = 0
    const nonce = faker.random.alphaNumeric(64)

    const block = new Block(data, timestamp, hash, prevHash, difficulty, nonce)

    expect(block.data).toEqual(data)
    expect(block.timestamp).toEqual(timestamp)
    expect(block.hash).toEqual(hash)
    expect(block.prevHash).toEqual(prevHash)
    expect(block.difficulty).toEqual(difficulty)
    expect(block.nonce).toEqual(nonce)
  })

  describe('hashBlockData()', () => {
    let data: any
    let timestamp: number
    let prevHash: string
    let difficulty: number
    let nonce: string

    beforeEach(() => {
      data = [faker.name.firstName(), faker.name.lastName()]
      timestamp = Date.now()
      prevHash = faker.random.alphaNumeric(64)
      difficulty = 1
      nonce = faker.random.alphaNumeric(64)
    })

    it('returns the same hashes for same input', () => {
      const h1 = hashBlockData(data, timestamp, prevHash, difficulty, nonce)
      const h2 = hashBlockData(data, timestamp, prevHash, difficulty, nonce)
      expect(h1).toEqual(h2)
    })

    it('returns different hashes for different input', () => {
      const h1 = hashBlockData(data, timestamp, prevHash, difficulty, nonce)
      const h2 = hashBlockData(data, timestamp + 1, prevHash, difficulty, nonce)
      expect(h1).not.toEqual(h2)
    })
  })
})
