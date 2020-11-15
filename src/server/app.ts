import express, { response } from 'express'
import bodyParser from 'body-parser'
import TransactionPool from '../crypto/transaction-pool'
import Wallet from '../crypto/wallet'
import Blockchain from '../blockchain/blockchain'
import PubSub from './pubsub'
import got from 'got'
import { GENESIS_DATA, PORT } from '../config'
import Block, { BlockData } from '../blockchain/block'
import TransactionMiner from './transaction-miner'
import path from 'path'
import { generateTransactionBlocks, generateWallets } from './seeder'
import Transaction from '../crypto/transaction'
import { TransactionData } from '../crypto/types'

export const app = express()
const rootNode = `http://127.0.0.1:${PORT}`

const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const wallet = new Wallet()
const pubsub = new PubSub(blockchain, transactionPool)
const miner = new TransactionMiner(blockchain, transactionPool, wallet, pubsub)

app.use(express.static(path.join(__dirname, '../../dist')))

const syncChains = () => {
  got(`${rootNode}/api/blocks`, {
    responseType: 'json',
  }).then((response) => {
    const newChain = (response.body as BlockData[])
      .map((obj: BlockData) => Block.fromObject(obj))
      .map((block) => {
        if (block.hash === GENESIS_DATA.hash) return block
        block.data = (block.data as TransactionData[]).map(
          (data) => new Transaction(data.id, data.outputMap, data.input)
        )
        return block
      })
    blockchain.replaceChain(newChain, false)
  })
}

if (process.env.START_AS_PEER === 'true') {
  syncChains()
}

app.use(bodyParser.json())

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain)
})

app.post('/api/mine', (req, res) => {
  const { data } = req.body
  blockchain.addData(data)
  pubsub.broadcastChain()

  res.redirect('/api/blocks')
})

app.post('/api/transact', (req, res) => {
  const { amount, recipient } = req.body
  let transaction = transactionPool.getExistingTransaction(wallet.publicKey)

  try {
    if (transaction !== undefined) {
      transaction.update(wallet, recipient, amount)
    } else {
      transaction = wallet.createTransaction(
        amount,
        recipient,
        blockchain.chain
      )
    }
  } catch (error) {
    return res.status(400).json({ type: 'error', message: error.message })
  }

  transactionPool.setTransaction(transaction)
  pubsub.broadcastTransaction(transaction)
  res.json({ transaction })
})

app.get('/api/transaction-pool-map', (req, res) => {
  res.json({
    type: 'success',
    map: Object.fromEntries(transactionPool.transactionMap.entries()),
  })
})

app.get('/api/mine-transactions', (req, res) => {
  miner.mineTransactions()

  res.redirect('/api/blocks')
})

app.get('/api/wallet-info', (req, res) => {
  res.json({
    address: wallet.publicKey,
    balance: wallet.calculateBalance(blockchain.chain),
  })
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'))
})

// if root node, then seed server with random data
if (process.env.START_AS_PEER !== 'true') {
  generateTransactionBlocks(
    10,
    3,
    generateWallets(4),
    blockchain.chain,
    transactionPool,
    miner
  )
}
