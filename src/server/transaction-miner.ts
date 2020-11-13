import Block from '../blockchain/block'
import Blockchain from '../blockchain/blockchain'
import Transaction from '../crypto/transaction'
import TransactionPool from '../crypto/transaction-pool'
import Wallet from '../crypto/wallet'
import PubSub from './pubsub'

class TransactionMiner {
  public blockchain: Blockchain
  public transactionPool: TransactionPool
  public wallet: Wallet
  public pubsub: PubSub

  constructor(
    blockchain: Blockchain,
    transactionPool: TransactionPool,
    wallet: Wallet,
    pubsub: PubSub
  ) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.wallet = wallet
    this.pubsub = pubsub
  }

  mineTransaction() {
    // get valid transactions from pool
    const transactions = this.transactionPool.getValidTransactions()

    // generate award for miners
    const reward = Transaction.rewardTransaction(this.wallet)
    transactions.push(reward)

    // add a block of these transactions to the blockchain
    this.blockchain.addData(transactions)

    // broadcast updated blockchain
    this.pubsub.broadcastChain()

    // clear the pool
    this.transactionPool.clear()
  }
}

export default TransactionMiner
