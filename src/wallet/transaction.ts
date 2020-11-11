import { v1 as uuid } from 'uuid'
import Wallet from './wallet'

class Transaction {
  public id: string
  public outputMap: { [key: string]: number }

  constructor(senderWallet: Wallet, recipient: string, amount: number) {
    this.id = uuid()
    this.outputMap = this.createOutputMap(senderWallet, recipient, amount)
  }

  createOutputMap(senderWallet: Wallet, recipient: string, amount: number) {
    const outputMap: { [key: string]: number } = {}
    outputMap[recipient] = amount
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount

    return outputMap
  }
}

export default Transaction
