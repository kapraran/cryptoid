import { ec as EC } from 'elliptic'
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

    return new Transaction(this, recipientAddress, amount)
  }
}

export default Wallet
