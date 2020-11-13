import redis, { RedisClient } from 'redis'
import Blockchain from '../blockchain/blockchain'
import { CHANNELS, REDIS_HOST } from '../config'

class PubSub {
  public blockchain: Blockchain
  public publisher: RedisClient
  public subscriber: RedisClient

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain
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
    this.publisher.publish(channel, message)
  }

  onMessage = (channel: string, message: string) => {
    console.log('Message received')

    if (channel === CHANNELS.BLOCKCHAIN) {
      const chain = JSON.parse(message)
      this.blockchain.replaceChain(chain)
    }
  }

  broadcastChain() {
    this.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(this.blockchain.chain))
  }
}

export default PubSub
