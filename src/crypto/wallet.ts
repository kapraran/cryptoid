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

  sign(data: any) {
    return this.keyPair.sign(hashData(data))
  }

  createTransaction(amount: number, recipientAddress: string) {
    if (amount > this.balance) throw new Error('Amount exceeds the balance')

    return Transaction.create(this, recipientAddress, amount)
  }

  calculateBalance(chain: Block[]) {
    const address = this.publicKey

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
