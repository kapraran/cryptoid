import { Block } from '../lib/block'
import { hashBlockData } from '../lib/utils'
import faker from 'faker'

faker.seed(1911)

describe('Block', () => {
  let exampleBlock: Block
  let data: any
  let prevHash: string
  let difficulty: number
  let nonce: string

  beforeAll(() => {
    data = faker.name.firstName()
    prevHash = faker.random.alphaNumeric(64)
    difficulty = 0
    nonce = faker.random.alphaNumeric(64)
    exampleBlock = Block.createBlock(data, difficulty, nonce, prevHash)
  })

  it('create an instance of block', () => {
    expect(exampleBlock.data).toEqual(data)
    expect(exampleBlock.prevHash).toEqual(prevHash)
    expect(exampleBlock.difficulty).toEqual(difficulty)
    expect(exampleBlock.nonce).toEqual(nonce)
  })

  describe('isEqual()', () => {})

  describe('isValid()', () => {
    it('block is valid when is not manipulated', () => {
      expect(exampleBlock.isValid()).toBe(true)
    })

    it('block is invalid when any of its fields is changed', () => {
      const block1 = new Block(
        'fake-data',
        exampleBlock.timestamp,
        exampleBlock.difficulty,
        exampleBlock.nonce,
        exampleBlock.prevHash,
        exampleBlock.hash
      )
      const block2 = new Block(
        exampleBlock.data,
        1,
        exampleBlock.difficulty,
        exampleBlock.nonce,
        exampleBlock.prevHash,
        exampleBlock.hash
      )
      const block3 = new Block(
        exampleBlock.data,
        exampleBlock.timestamp,
        12,
        exampleBlock.nonce,
        exampleBlock.prevHash,
        exampleBlock.hash
      )
      const block4 = new Block(
        exampleBlock.data,
        exampleBlock.timestamp,
        exampleBlock.difficulty,
        'fake-nonce',
        exampleBlock.prevHash,
        exampleBlock.hash
      )
      const block5 = new Block(
        exampleBlock.data,
        exampleBlock.timestamp,
        exampleBlock.difficulty,
        exampleBlock.nonce,
        'fake-prevHash',
        exampleBlock.hash
      )

      expect(block1.isValid()).toBe(false)
      expect(block2.isValid()).toBe(false)
      expect(block3.isValid()).toBe(false)
      expect(block4.isValid()).toBe(false)
      expect(block5.isValid()).toBe(false)
    })
  })

  describe('hashBlockData()', () => {
    it('returns the same hashes for same input', () => {
      const h1 = hashBlockData(
        data,
        exampleBlock.timestamp,
        prevHash,
        difficulty,
        nonce
      )
      const h2 = hashBlockData(
        data,
        exampleBlock.timestamp,
        prevHash,
        difficulty,
        nonce
      )
      expect(h1).toEqual(h2)
    })

    it('returns different hashes for different input', () => {
      const h1 = hashBlockData(
        data,
        exampleBlock.timestamp,
        prevHash,
        difficulty,
        nonce
      )
      const h2 = hashBlockData(
        data,
        exampleBlock.timestamp + 1,
        prevHash,
        difficulty,
        nonce
      )
      expect(h1).not.toEqual(h2)
    })
  })
})
