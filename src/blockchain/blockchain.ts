import { MINE_RATE } from '../config'
import Block from './block'

class Blockchain {
  public chain: Block[]

  constructor() {
    // always start with the genesis block
    this.chain = [Block.getGenesis()]
  }

  /**
   * Adds a new block to the chain
   *
   * @param data
   */
  addData(data: any) {
    const prevBlock = this.getLastBlock()
    const block = Block.mineBlock(prevBlock, data)
    this.chain.push(block)

    return block
  }

  /**
   * Returns the last block of the chain
   */
  getLastBlock() {
    return this.chain[this.chain.length - 1]
  }

  /**
   *
   * @param newChain
   */
  replaceChain(newChain: Block[], onSuccess?: () => void) {
    if (newChain.length <= this.chain.length) return false

    if (Blockchain.isValid(newChain)) {
      this.chain = newChain
      if (onSuccess) onSuccess()
      return true
    }

    return false
  }

  /**
   * Checks if a blockchain is valid
   */
  static isValid(chain: Block[]) {
    // it should start with the genesis block
    if (chain.length < 1 || !chain[0].isEqual(Block.getGenesis())) {
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]

      // each of the block should be valid
      if (!block.isValid()) return false

      // each prevHash should match the hash of the previous block
      if (block.prevHash !== chain[i - 1].hash) return false

      // there shouldn't be a big jump between blocks
      if (Math.abs(block.difficulty - chain[i - 1].difficulty) > 1) return false
    }

    return true
  }
}

export default Blockchain
