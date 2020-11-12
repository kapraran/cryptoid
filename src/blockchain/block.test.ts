import Block from './block'
import faker from 'faker'
import { FAKER_SEED, MINE_RATE } from '../config'
import { hashData } from '../util/utils'

faker.seed(FAKER_SEED)

describe('Block', () => {
  let exampleBlock: Block
  let data: any
  let prevHash: string
  let difficulty: number
  let nonce: number

  beforeAll(() => {
    data = faker.name.firstName()
    prevHash = faker.random.alphaNumeric(64)
    difficulty = 1
    nonce = faker.random.number()
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
        faker.name.title(),
        exampleBlock.timestamp,
        exampleBlock.difficulty,
        exampleBlock.nonce,
        exampleBlock.prevHash,
        exampleBlock.hash
      )
      const block2 = new Block(
        exampleBlock.data,
        faker.random.number(),
        exampleBlock.difficulty,
        exampleBlock.nonce,
        exampleBlock.prevHash,
        exampleBlock.hash
      )
      const block3 = new Block(
        exampleBlock.data,
        exampleBlock.timestamp,
        faker.random.number(),
        exampleBlock.nonce,
        exampleBlock.prevHash,
        exampleBlock.hash
      )
      const block4 = new Block(
        exampleBlock.data,
        exampleBlock.timestamp,
        exampleBlock.difficulty,
        faker.random.number(),
        exampleBlock.prevHash,
        exampleBlock.hash
      )
      const block5 = new Block(
        exampleBlock.data,
        exampleBlock.timestamp,
        exampleBlock.difficulty,
        exampleBlock.nonce,
        faker.random.alphaNumeric(64),
        exampleBlock.hash
      )

      expect(block1.isValid()).toBe(false)
      expect(block2.isValid()).toBe(false)
      expect(block3.isValid()).toBe(false)
      expect(block4.isValid()).toBe(false)
      expect(block5.isValid()).toBe(false)
    })
  })

  describe('getGenesis()', () => {
    it('returns a valid block', () => {
      expect(Block.getGenesis() instanceof Block).toBe(true)
    })

    it('always returns the same block', () => {
      const blockA = Block.getGenesis()
      const blockB = Block.getGenesis()

      expect(blockA.isEqual(blockB)).toBe(true)
    })
  })

  describe('Block.hash', () => {
    it('is not the same for different input', () => {
      const blockA = Block.createBlock(data, difficulty, nonce, prevHash)
      const blockB = Block.createBlock(data, difficulty + 1, nonce, prevHash)

      expect(blockA.hash).not.toEqual(blockB.hash)
    })
  })

  describe('mineBlock()', () => {
    const lastBlock = Block.getGenesis()
    const data = faker.name.firstName()
    const minedBlock = Block.mineBlock(lastBlock, data)

    it('returns a valid Block', () => {
      expect(minedBlock instanceof Block).toBe(true)
      expect(minedBlock.isValid()).toBe(true)
    })

    it('set the `prevHash` to genesis hash', () => {
      expect(minedBlock.prevHash).toEqual(lastBlock.hash)
    })

    it('sets the `data`', () => {
      expect(minedBlock.data).toEqual(data)
    })

    it('creates the expected hash based on the given input', () => {
      const hash = hashData(
        data,
        minedBlock.timestamp,
        minedBlock.difficulty,
        minedBlock.nonce,
        lastBlock.hash
      )
      expect(minedBlock.hash).toEqual(hash)
    })

    it('matches the difficulty', () => {
      expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
        '0'.repeat(minedBlock.difficulty)
      )
    })
  })

  describe('nextDifficulty()', () => {
    it('raises the difficulty if mined quickly', () => {
      const newTimestamp = exampleBlock.timestamp + MINE_RATE / 2

      expect(
        Block.nextDifficulty(
          exampleBlock,
          newTimestamp
        )
      ).toEqual(exampleBlock.difficulty + 1)
    })

    it('lowers the difficulty if mined slowly', () => {
      const newTimestamp = exampleBlock.timestamp + MINE_RATE + 100

      expect(
        Block.nextDifficulty(
          exampleBlock,
          newTimestamp
        )
      ).toEqual(exampleBlock.difficulty - 1)
    })
  })
})
