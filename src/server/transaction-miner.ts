import Block from '../blockchain/block'
import Blockchain from '../blockchain/blockchain'
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
    // generate award for miners
    // add a block of these transactions to the blockchain
    // broadcast updated blockchain
    // clear the pool
  }
}

export default TransactionMiner
