import Blockchain from '../blockchain/blockchain'
import Transaction from './transaction'
import TransactionPool from './transaction-pool'
import Wallet from './wallet'

describe('TransactionPool', () => {
  let transactionPool: TransactionPool
  let transaction: Transaction
  let wallet: Wallet

  beforeEach(() => {
    transactionPool = new TransactionPool()
    wallet = new Wallet()
    transaction = Transaction.create(wallet, 'some-random-recipient', 25.0)
  })

  describe('setTransaction()', () => {
    it('sets a transaction', () => {
      transactionPool.setTransaction(transaction)
      expect(transactionPool.transactionMap.get(transaction.id)).toBe(
        transaction
      )
    })
  })

  describe('getExistingTransaction()', () => {
    it('returns the same transaction for the same recipient', () => {
      transactionPool.setTransaction(transaction)
      expect(transactionPool.getExistingTransaction(wallet.publicKey)).toBe(
        transaction
      )
    })
  })

  describe('getValidTransactions()', () => {
    let validTransactions: Transaction[]
    let errorMock: jest.Mock

    beforeEach(() => {
      validTransactions = []
      errorMock = jest.fn()
      global.console.error = errorMock

      for (let i = 0; i < 10; i++) {
        transaction = Transaction.create(wallet, 'recipient-id', 15.0)

        if (i % 3 === 0) {
          transaction.input.amount = 999999
        } else if (i % 3 === 1) {
          transaction.input.signature = new Wallet().sign('hello')
        } else {
          validTransactions.push(transaction)
        }

        transactionPool.setTransaction(transaction)
      }
    })

    it('returns only the valid transactions', () => {
      expect(transactionPool.getValidTransactions()).toEqual(validTransactions)
      expect(errorMock).toHaveBeenCalled()
    })
  })

  describe('clear()', () => {
    it('clears all transactions', () => {
      transactionPool.clear()
      expect(transactionPool.transactionMap.size).toEqual(0)
    })
  })

  describe('clearBlockchainTransactions()', () => {
    it('clears only the transactions that exists in the blockchain', () => {
      const blockchain = new Blockchain()
      const expectedTransactions = new Map<string, Transaction>()

      for (let i = 0; i < 10; i++) {
        const transaction = new Wallet().createTransaction(
          2.0,
          'some-random-addr'
        )

        transactionPool.setTransaction(transaction)

        if (i % 2 === 0) {
          blockchain.addData([transaction])
        } else {
          expectedTransactions.set(transaction.id, transaction)
        }
      }

      transactionPool.clearBlockchainTransactions(blockchain.chain)

      expect(transactionPool.transactionMap).toEqual(expectedTransactions)
    })
  })
})
