import { GENESIS_DATA, MINE_RATE } from '../config'
import { hashData, satisfiesDifficulty } from '../util/utils'
//@ts-ignore
import hexToBinary from 'hex-to-binary'

export interface BlockData {
  data: any
  timestamp: number
  difficulty: number
  nonce: number
  prevHash: string
  hash: string
}

class Block {
  public data: any
  public timestamp: number
  public difficulty: number
  public nonce: number
  public prevHash: string
  public hash: string

  constructor(
    data: any,
    timestamp: number,
    difficulty: number,
    nonce: number,
    prevHash: string,
    hash: string
  ) {
    this.data = data
    this.timestamp = timestamp
    this.difficulty = difficulty
    this.nonce = nonce
    this.prevHash = prevHash
    this.hash = hash
  }

  /**
   * Checks if the block is equal with `anotherBlock`
   * based on their hashes
   *
   * @param otherBlock
   */
  isEqual(otherBlock: Block): boolean {
    return (
      this.isValid() && otherBlock.isValid() && this.hash === otherBlock.hash
    )
  }

  /**
   * Checks if the block is valid
   */
  isValid(): boolean {
    const validHash = hashData(
      this.data,
      this.timestamp,
      this.prevHash,
      this.difficulty,
      this.nonce
    )

    return this.hash === validHash
  }

  /**
   * Returns the genesis block
   */
  static getGenesis(): Block {
    // update hash
    GENESIS_DATA.hash = hashData(
      GENESIS_DATA.data,
      GENESIS_DATA.timestamp,
      GENESIS_DATA.prevHash,
      GENESIS_DATA.difficulty,
      GENESIS_DATA.nonce
    )

    // create and store a valid block
    return new Block(
      GENESIS_DATA.data,
      GENESIS_DATA.timestamp,
      GENESIS_DATA.difficulty,
      GENESIS_DATA.nonce,
      GENESIS_DATA.prevHash,
      GENESIS_DATA.hash
    )
  }

  /**
   *
   * @param prevBlock
   * @param newTimestamp
   */
  static nextDifficulty(prevBlock: Block, newTimestamp: number) {
    let { difficulty, timestamp } = prevBlock
    if (newTimestamp - timestamp >= MINE_RATE) difficulty -= 1
    if (newTimestamp - timestamp < MINE_RATE) difficulty += 1

    return Math.max(1, difficulty)
  }

  /**
   * Creates and returns a valid block based on the input data
   *
   * @param data
   * @param difficulty
   * @param nonce
   * @param prevHash
   */
  static createBlock(
    data: any,
    difficulty: number,
    nonce: number,
    prevHash: string
  ): Block {
    const timestamp = Date.now()
    const hash = hashData(data, timestamp, prevHash, difficulty, nonce)
    return new Block(data, timestamp, difficulty, nonce, prevHash, hash)
  }

  /**
   *
   * @param prevBlock
   * @param data
   */
  static mineBlock(prevBlock: Block, data: any) {
    const prevHash = prevBlock.hash
    let timestamp = Date.now()
    let difficulty = prevBlock.difficulty

    let hash
    let nonce = 0
    while (true) {
      timestamp = Date.now()
      difficulty = Block.nextDifficulty(prevBlock, timestamp)
      nonce++
      hash = hashData(data, timestamp, prevHash, difficulty, nonce)

      if (satisfiesDifficulty(hexToBinary(hash), difficulty)) break
    }

    return new Block(data, timestamp, difficulty, nonce, prevHash, hash)
  }

  static fromObject(obj: BlockData) {
    return new Block(
      obj.data,
      obj.timestamp,
      obj.difficulty,
      obj.nonce,
      obj.prevHash,
      obj.hash
    )
  }
}

export default Block
