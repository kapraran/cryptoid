import { verifySignature } from '../util/utils'
import Transaction from './transaction'
import Wallet from './wallet'

describe('Wallet', () => {
  let wallet: Wallet

  beforeEach(() => {
    wallet = new Wallet()
  })

  it('has a balance', () => {
    expect(wallet).toHaveProperty('balance')
  })

  it('has a public key', () => {
    expect(wallet).toHaveProperty('publicKey')
  })

  describe('signing data', () => {
    const data = 'Hello World!'

    it('verifies a valid signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        })
      ).toBe(true)
    })

    it('does not verify an invalid signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        })
      ).toBe(false)
    })
  })

  describe('createTransaction()', () => {
    describe('and the amount exceeds the balance', () => {
      it('throws an error', () => {
        expect(() => {
          wallet.createTransaction(99999, 'invalid-key')
        }).toThrow('Amount exceeds the balance')
      })
    })

    describe('and the amount is less than the balance', () => {
      let transaction: Transaction
      let amount: number
      let recipient: string

      beforeEach(() => {
        amount = 10
        recipient = 'whatever-string-we-want'
        transaction = wallet.createTransaction(amount, recipient)
      })

      it('creates a Transaction', () => {
        expect(transaction instanceof Transaction).toBe(true)
      })

      it('matches the wallet with the input', () => {
        expect(transaction.input.address).toEqual(wallet.publicKey)
      })

      it('outputs the amount for the recipient', () => {
        expect(transaction.outputMap[recipient]).toEqual(amount)
      })

      it('outputs the difference for the sender', () => {
        expect(transaction.outputMap[wallet.publicKey]).toEqual(
          wallet.balance - amount
        )
      })
    })
  })
})
