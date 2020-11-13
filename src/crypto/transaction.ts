import { v1 as uuid } from 'uuid'
import { verifySignature } from '../util/utils'
import { OutputMap, TransactionData, TransactionInput } from './types'
import Wallet from './wallet'

class Transaction {
  public id: string
  public outputMap: OutputMap
  public input: TransactionInput

  constructor(senderWallet: Wallet, recipient: string, amount: number, outputMap?: OutputMap, input?: TransactionInput) {
    this.id = uuid()
    this.outputMap = outputMap || this.createOutputMap(senderWallet, recipient, amount)
    this.input = input || this.createInput(senderWallet, this.outputMap)
  }

  createOutputMap(senderWallet: Wallet, recipient: string, amount: number) {
    const outputMap: OutputMap = {}
    outputMap[recipient] = amount
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount

    return outputMap
  }

  createInput(
    senderWallet: Wallet,
    outputMap: OutputMap
  ): TransactionInput {
    return {
      timestamp: Date.now(),
      address: senderWallet.publicKey,
      amount: senderWallet.balance,
      signature: senderWallet.sign(outputMap),
    }
  }

  update(senderWallet: Wallet, newRecipient: string, newAmount: number) {
    if (newAmount > this.outputMap[senderWallet.publicKey])
      throw new Error('Amount exceeds the balance')

    if (newRecipient in this.outputMap) {
      this.outputMap[newRecipient] += newAmount
    } else {
      this.outputMap[newRecipient] = newAmount
    }

    // update the output map with the new recipient
    this.outputMap[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey] - newAmount

    // update input field
    this.input.timestamp = Date.now()
    this.input.signature = senderWallet.sign(this.outputMap)
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

  // static rewardTransaction(wallet: Wallet) {
  //   return new Transaction(wallet, )
  // }

  /**
   *
   * @param obj
   */
  static fromObject(obj: TransactionData) {
    // create dummy transaction
    const transaction = new Transaction(new Wallet(), 'none', 0.0)

    // fill with object's data
    transaction.id = obj.id
    transaction.outputMap = obj.outputMap
    transaction.input = obj.input

    return transaction
  }
}

export default Transaction
