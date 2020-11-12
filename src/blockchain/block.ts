import { GENESIS_DATA } from '../config'
import { hashData } from '../util/utils'

class Block {
  private static genesisBlock: Block | undefined

  public readonly data: any
  public readonly timestamp: number
  public readonly difficulty: number
  public readonly nonce: string
  public readonly prevHash: string
  public readonly hash: string

  constructor(
    data: any,
    timestamp: number,
    difficulty: number,
    nonce: string,
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
   * @param anotherBlock
   */
  isEqual(anotherBlock: Block): boolean {
    return this.hash == anotherBlock.hash
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
    if (Block.genesisBlock !== undefined)
    return Block.genesisBlock

    // update hash
    GENESIS_DATA.hash = hashData(
      GENESIS_DATA.data,
      GENESIS_DATA.timestamp,
      GENESIS_DATA.prevHash,
      GENESIS_DATA.difficulty,
      GENESIS_DATA.nonce
    )

    // create and store a valid block
    Block.genesisBlock = new Block(
      GENESIS_DATA.data,
      GENESIS_DATA.timestamp,
      GENESIS_DATA.difficulty,
      GENESIS_DATA.nonce,
      GENESIS_DATA.prevHash,
      GENESIS_DATA.hash
    )

    return Block.genesisBlock
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
    nonce: string,
    prevHash: string
  ): Block {
    const timestamp = Date.now()
    const hash = hashData(data, timestamp, prevHash, difficulty, nonce)
    return new Block(data, timestamp, difficulty, nonce, prevHash, hash)
  }

  static mineBlock(lastBlock: Block, data: any) {
    const now = Date.now()
    return new Block(data, now, 0, 'abc', lastBlock.hash, hashData(data, now, 0, 'abc', lastBlock.hash))
  }
}

export default Block
