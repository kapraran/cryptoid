import { MINE_RATE, MINE_REWARD } from '../config'
import Transaction from '../crypto/transaction'
import Wallet from '../crypto/wallet'
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
  replaceChain(
    newChain: Block[],
    validateTransactionData: boolean = true,
    onSuccess?: () => void
  ) {
    if (newChain.length <= this.chain.length) return false

    if (
      Blockchain.isValid(newChain) &&
      (!validateTransactionData ||
        (this.validTransactionData(newChain) &&
          this.validTransactionData(newChain)))
    ) {
      this.chain = newChain
      if (onSuccess) onSuccess()
      return true
    }

    return false
  }

  /**
   *
   * @param chain
   */
  validTransactionData(chain: Block[]) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const transactionSet = new Set()
      let rewardTransactions = 0
      const transactions = block.data as Transaction[]

      for (let transaction of transactions) {
        // check reward transactions
        if (transaction.input.address === MINE_REWARD.input.address) {
          rewardTransactions++

          // check for multiple reward transactions
          if (rewardTransactions > 1) return false

          // check mine reward amount
          if (Object.values(transaction.outputMap)[0] !== MINE_REWARD.amount)
            return false
        }

        // check non-reward transactions
        else {
          if (!Transaction.isValidTransaction(transaction)) return false

          const balance = Wallet.calculateBalanceForAddress(
            transaction.input.address,
            this.chain
          )
          if (transaction.input.amount !== balance) return false
        }

        if (transactionSet.has(transaction.id)) return false
        transactionSet.add(transaction.id)
      }

      if (rewardTransactions !== 1) return false
    }

    return true
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
