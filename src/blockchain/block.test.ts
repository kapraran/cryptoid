import Block from './block'
import faker from 'faker'
import { FAKER_SEED } from '../config'

faker.seed(FAKER_SEED)

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

  describe('Block.hash', () => {
    it('is not the same for different input', () => {
      const blockA = Block.createBlock(data, difficulty, nonce, prevHash)
      const blockB = Block.createBlock(data, difficulty + 1, nonce, prevHash)

      expect(blockA.hash).not.toEqual(blockB.hash)
    })
  })
})
