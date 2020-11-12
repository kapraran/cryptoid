import Transaction from './transaction'

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
}

export default TransactionPool
