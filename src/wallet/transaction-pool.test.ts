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
    transaction = new Transaction(wallet, 'some-random-recipient', 25.0)
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
})
