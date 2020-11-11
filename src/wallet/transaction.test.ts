import { ec } from '../util/ec'
import Transaction from './transaction'
import Wallet from './wallet'

describe('Transaction', () => {
  let senderWallet: Wallet
  let recipientAddress: string
  let transaction: Transaction
  let amount: number

  beforeEach(() => {
    senderWallet = new Wallet()
    const keyPair = ec.genKeyPair()
    recipientAddress = keyPair.getPublic().encode('hex', false)
    amount = 100.0

    transaction = new Transaction(senderWallet, recipientAddress, amount)
  })

  it('has an id', () => {
    expect(transaction).toHaveProperty('id')
  })

  describe('outputMap', () => {
    it('has an outputMap', () => {
      expect(transaction).toHaveProperty('outputMap')
    })

    it('outputs the `amount` to the recipient', () => {
      expect(transaction.outputMap[recipientAddress]).toEqual(amount)
    })

    it('outputs the remaining back to senderWallet', () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      )
    })
  })
})
