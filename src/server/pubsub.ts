import { parse } from 'path'
import redis, { RedisClient } from 'redis'
import Block, { BlockData } from '../blockchain/block'
import Blockchain from '../blockchain/blockchain'
import { CHANNELS, REDIS_HOST } from '../config'
import Transaction from '../crypto/transaction'
import TransactionPool from '../crypto/transaction-pool'
import { TransactionData } from '../crypto/types'

class PubSub {
  public blockchain: Blockchain
  public transactionPool: TransactionPool
  public publisher: RedisClient
  public subscriber: RedisClient

  constructor(blockchain: Blockchain, transactionPool: TransactionPool) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.publisher = redis.createClient({ host: REDIS_HOST })
    this.subscriber = redis.createClient({ host: REDIS_HOST })

    this.registerSubscriptions()

    this.subscriber.on('message', this.onMessage)
  }

  registerSubscriptions() {
    Object.values(CHANNELS).forEach((channel) =>
      this.subscriber.subscribe(channel)
    )
  }

  /**
   * Publishes a message to a channel without receiving it back
   *
   * @param channel
   * @param message
   */
  publish(channel: string, message: string) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel)
      })
    })
  }

  onMessage = (channel: string, message: string) => {
    const parsedMessage = JSON.parse(message)

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        const chain = (parsedMessage as BlockData[]).map((obj: BlockData) =>
          Block.fromObject(obj)
        )
        console.log('trying to replace the chain')
        this.blockchain.replaceChain(chain, true, () => {
          console.log('chain replaced')
          this.transactionPool.clearBlockchainTransactions(chain)
        })
        break
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(
          Transaction.fromObject(parsedMessage as TransactionData)
        )
        break
      default:
        break
    }
  }

  broadcastChain() {
    this.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(this.blockchain.chain))
  }

  broadcastTransaction(transaction: Transaction) {
    this.publish(CHANNELS.TRANSACTION, JSON.stringify(transaction))
  }
}

export default PubSub
