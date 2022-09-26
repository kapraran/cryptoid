import Block from '../blockchain/block';
import Transaction from './transaction';

class TransactionPool {
  public transactionMap: Map<string, Transaction>;

  constructor() {
    this.transactionMap = new Map();
  }

  setTransaction(transaction: Transaction) {
    this.transactionMap.set(transaction.id, transaction);
  }

  /**
   * returns an existing transation of the pool with a specific
   * address or undefined if it wasn't found
   *
   * @param address
   */
  getExistingTransaction(address: string) {
    return Array.from(this.transactionMap.values()).find(
      (transaction) => transaction.input.address === address
    );
  }

  /**
   * returns a list of only the valid transactions of the pool
   */
  getValidTransactions() {
    return Array.from(this.transactionMap.values()).filter((transaction) =>
      Transaction.isValidTransaction(transaction)
    );
  }

  /**
   * removes all transactions from the pool
   */
  clear() {
    this.transactionMap.clear();
  }

  /**
   *
   * @param chain
   */
  clearBlockchainTransactions(chain: Block[]) {
    for (let block of chain) {
      for (let transaction of block.data) {
        if (this.transactionMap.has(transaction.id))
          this.transactionMap.delete(transaction.id);
      }
    }
  }
}

export default TransactionPool;
