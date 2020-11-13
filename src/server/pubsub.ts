import { parse } from 'path'
import redis, { RedisClient } from 'redis'
import Block, { BlockData } from '../blockchain/block'
import Blockchain from '../blockchain/blockchain'
import { CHANNELS, REDIS_HOST } from '../config'
import Transaction, { TransactionData } from '../wallet/transaction'
import TransactionPool from '../wallet/transaction-pool'

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
        this.blockchain.replaceChain(chain)
        break
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(
          new Transaction(parsedMessage as TransactionData)
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
