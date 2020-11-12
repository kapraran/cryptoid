import { ec as EC } from 'elliptic'
import { v1 as uuid } from 'uuid'
import { verifySignature } from '../util/utils'
import Wallet from './wallet'

export interface TransactionInput {
  timestamp: number
  address: string
  amount: number
  signature: EC.Signature
}

class Transaction {
  public id: string
  public outputMap: { [key: string]: number }
  public input: TransactionInput

  constructor(senderWallet: Wallet, recipient: string, amount: number) {
    this.id = uuid()
    this.outputMap = this.createOutputMap(senderWallet, recipient, amount)
    this.input = this.createInput(senderWallet, this.outputMap)
  }

  createOutputMap(senderWallet: Wallet, recipient: string, amount: number) {
    const outputMap: { [key: string]: number } = {}
    outputMap[recipient] = amount
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount

    return outputMap
  }

  createInput(
    senderWallet: Wallet,
    outputMap: { [key: string]: number }
  ): TransactionInput {
    return {
      timestamp: Date.now(),
      address: senderWallet.publicKey,
      amount: senderWallet.balance,
      signature: senderWallet.sign(outputMap),
    }
  }

  static isValidTransaction(transaction: Transaction) {
    const outputSum = Object.values(transaction.outputMap).reduce<number>(
      (sum, amount) => {
        return sum + amount
      },
      0
    )

    if (outputSum != transaction.input.amount) {
      console.error('Invalid transaction amount')
      return false
    }

    if (
      !verifySignature({
        publicKey: transaction.input.address,
        data: transaction.outputMap,
        signature: transaction.input.signature,
      })
    ) {
      console.error('Cannot verify the transaction')
      return false
    }

    return true
  }
}

export default Transaction
