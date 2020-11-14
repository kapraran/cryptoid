import Blockchain from '../blockchain/blockchain'
import { STARTING_BALANCE } from '../config'
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

  describe('calculateBalance()', () => {
    let blockchain: Blockchain

    beforeEach(() => {
      blockchain = new Blockchain()
    })

    describe('when there are no transactions related to the wallet', () => {
      it('returns the starting balance', () => {
        expect(wallet.calculateBalance(blockchain.chain)).toEqual(
          STARTING_BALANCE
        )
      })
    })

    describe('when there are a few transactions related to the wallet', () => {
      let transaction1: Transaction
      let transaction2: Transaction

      beforeEach(() => {
        transaction1 = new Wallet().createTransaction(100, wallet.publicKey)
        transaction2 = new Wallet().createTransaction(200, wallet.publicKey)

        blockchain.addData([transaction1, transaction2])
      })

      it('adds the sum to the wallet balance', () => {
        expect(wallet.calculateBalance(blockchain.chain)).toEqual(
          STARTING_BALANCE +
            transaction1.outputMap[wallet.publicKey] +
            transaction2.outputMap[wallet.publicKey]
        )
      })

      describe('and the wallet has made a transaction', () => {
        let recentTransaction: Transaction

        beforeEach(() => {
          recentTransaction = wallet.createTransaction(
            12.45,
            'some-rand-address'
          )
          blockchain.addData([recentTransaction])
        })

        it('returns the output of the recent transaction', () => {
          expect(wallet.calculateBalance(blockchain.chain)).toEqual(
            recentTransaction.outputMap[wallet.publicKey]
          )
        })

        describe('and there are outputs next to and after the transaction', () => {
          let sameBlockTransaction: Transaction
          let nextBlockTransaction: Transaction

          beforeEach(() => {
            recentTransaction = wallet.createTransaction(44, 'some-address-2')
            sameBlockTransaction = Transaction.rewardTransaction(wallet)
            blockchain.addData([recentTransaction, sameBlockTransaction])

            nextBlockTransaction = new Wallet().createTransaction(
              23.2201,
              wallet.publicKey
            )
            blockchain.addData([nextBlockTransaction])
          })

          it('includes the output amounts of the recent, related to wallet, transactions', () => {
            expect(wallet.calculateBalance(blockchain.chain)).toEqual(
              recentTransaction.outputMap[wallet.publicKey] +
                sameBlockTransaction.outputMap[wallet.publicKey] +
                nextBlockTransaction.outputMap[wallet.publicKey]
            )
          })
        })
      })
    })
  })
})
