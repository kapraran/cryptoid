import Transaction from './transaction'
import Wallet from './wallet'

class TransactionPool {
  public transactionMap: Map<string, Transaction>

  constructor() {
    this.transactionMap = new Map()
  }

  setTransaction(transaction: Transaction) {
    this.transactionMap.set(transaction.id, transaction)
  }

  getExistingTransaction(address: string) {
    return Array.from(this.transactionMap.values()).find(
      (transaction) => transaction.input.address === address
    )
  }

  getValidTransactions() {
    return Array.from(this.transactionMap.values()).filter(
      (transaction) => Transaction.isValidTransaction(transaction)
    )
  }
}

export default TransactionPool
