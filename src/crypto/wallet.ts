import { ec as EC } from 'elliptic'
import Block from '../blockchain/block'
import { STARTING_BALANCE } from '../config'
import { ec } from '../util/ec'
import { hashData } from '../util/utils'
import Transaction from './transaction'

class Wallet {
  public balance: number
  private keyPair: EC.KeyPair
  public publicKey: string

  constructor() {
    this.balance = STARTING_BALANCE

    // create a public key
    this.keyPair = ec.genKeyPair()
    this.publicKey = this.keyPair.getPublic().encode('hex', false)
  }

  /**
   * Sings the data using the wallet's keypair
   *
   * @param data
   */
  sign(data: any) {
    return this.keyPair.sign(hashData(data))
  }

  /**
   *
   * @param amount
   * @param recipientAddress
   * @param chain
   */
  createTransaction(amount: number, recipientAddress: string, chain?: Block[]) {
    // update wallet's balance if a chain is passed
    if (chain) this.balance = this.calculateBalance(chain)

    if (amount > this.balance) throw new Error('Amount exceeds the balance')

    return Transaction.create(this, recipientAddress, amount)
  }

  /**
   * Calculates the balance of the wallet based on the
   * transactions of the passed `chain`
   *
   * @param chain
   */
  calculateBalance(chain: Block[]) {
    return Wallet.calculateBalanceForAddress(this.publicKey, chain)
  }

  /**
   *
   * @param address
   * @param chain
   */
  static calculateBalanceForAddress(address: string, chain: Block[]) {
    return chain.slice(1).reduce<number>((total, block) => {
      const transactions = block.data as Transaction[]
      return transactions.reduce<number>((total, transaction) => {
        if (transaction.input.address === address)
          return transaction.outputMap[address]

        if (address in transaction.outputMap)
          return total + transaction.outputMap[address]

        return total
      }, total)
    }, STARTING_BALANCE)
  }
}

export default Wallet
