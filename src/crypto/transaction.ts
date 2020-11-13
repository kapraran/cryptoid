import { v1 as uuid } from 'uuid'
import { MINE_REWARD } from '../config'
import { verifySignature } from '../util/utils'
import { OutputMap, TransactionData, TransactionInput } from './types'
import Wallet from './wallet'

class Transaction {
  public id: string
  public outputMap: OutputMap
  public input: TransactionInput

  constructor(id: string, outputMap: OutputMap, input: TransactionInput) {
    this.id = id
    this.outputMap = outputMap
    this.input = input
  }

  static create(senderWallet: Wallet, recipient: string, amount: number) {
    const id = uuid()
    const outputMap = Transaction.createOutputMap(
      senderWallet,
      recipient,
      amount
    )
    const input = Transaction.createInput(senderWallet, outputMap)

    return new Transaction(id, outputMap, input)
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

  static createOutputMap(
    senderWallet: Wallet,
    recipient: string,
    amount: number
  ) {
    const outputMap: OutputMap = {}
    outputMap[recipient] = amount
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount

    return outputMap
  }

  static createInput(
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

  /**
   *
   * @param wallet
   */
  static rewardTransaction(wallet: Wallet) {
    return new Transaction(
      uuid(),
      {
        [wallet.publicKey]: MINE_REWARD.amount,
      },
      MINE_REWARD.input
    )
  }

  /**
   *
   * @param obj
   */
  static fromObject(obj: TransactionData) {
    return new Transaction(obj.id, obj.outputMap, obj.input)
  }
}

export default Transaction
