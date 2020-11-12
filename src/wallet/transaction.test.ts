import { ec as EC } from 'elliptic'
import { ec } from '../util/ec'
import { verifySignature } from '../util/utils'
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

  describe('input', () => {
    it('has an input', () => {
      expect(transaction).toHaveProperty('input')
    })

    it('has an input.timestamp', () => {
      expect(transaction.input).toHaveProperty('timestamp')
    })

    it('sets the amount to the senderWallet.balance', () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance)
    })

    it('sets the addres to the senderWallet.publicKey', () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey)
    })

    it('should have signed the input', () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true)
    })
  })

  describe('isValidTransaction()', () => {
    let errorMock: jest.Mock

    beforeEach(() => {
      errorMock = jest.fn()
      global.console.error = errorMock
    })

    describe('when transaction is valid', () => {
      it('returns true', () => {
        expect(Transaction.isValidTransaction(transaction)).toBe(true)
      })
    })

    describe('when transaction is invalid', () => {
      describe('and the outputMap is invalid', () => {
        it('returns false', () => {
          transaction.outputMap[senderWallet.publicKey] = 12345
          expect(Transaction.isValidTransaction(transaction)).toBe(false)
          expect(errorMock).toHaveBeenCalled()
        })
      })

      describe('and the input is invalid', () => {
        it('returns false with signature from same wallet', () => {
          transaction.input.signature = senderWallet.sign('invalid-data')
          expect(Transaction.isValidTransaction(transaction)).toBe(false)
          expect(errorMock).toHaveBeenCalled()
        })

        it('returns false with signature from another wallet', () => {
          transaction.input.signature = new Wallet().sign(transaction.outputMap)
          expect(Transaction.isValidTransaction(transaction)).toBe(false)
          expect(errorMock).toHaveBeenCalled()
        })
      })
    })
  })

  describe('update()', () => {
    let originalSignature: EC.Signature
    let originalRemaining: number
    let newRecipient: string
    let newAmount: number

    beforeEach(() => {
      originalSignature = transaction.input.signature
      originalRemaining = transaction.outputMap[senderWallet.publicKey]
      newRecipient = 'some-random-key-123'
      newAmount = 5

      transaction.update(senderWallet, newRecipient, newAmount)
    })

    it('outputs the amount to the new recipient', () => {
      expect(transaction.outputMap[newRecipient]).toEqual(newAmount)
    })

    it('outputs the updated remaining balance for the sender', () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        originalRemaining - newAmount
      )
    })

    it('maintains the total output to be equal to the input amount', () => {
      const outputSum = Object.values(transaction.outputMap).reduce<number>(
        (sum, amount) => sum + amount,
        0
      )
      expect(outputSum).toEqual(transaction.input.amount)
    })

    it('has an updated valid signature', () => {
      expect(transaction.input.signature).not.toEqual(originalSignature)
      expect(transaction.input.signature).toEqual(
        senderWallet.sign(transaction.outputMap)
      )
    })
  })
})
