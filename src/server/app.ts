import express from 'express'
import bodyParser from 'body-parser'
import Transaction from '../wallet/transaction'
import TransactionPool from '../wallet/transaction-pool'
import Wallet from '../wallet/wallet'

export const app = express()
const transactionPool = new TransactionPool()
const wallet = new Wallet()

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('hello world!')
})

app.post('/api/transact', (req, res) => {
  const { amount, recipient } = req.body
  let transaction = transactionPool.getExistingTransaction(wallet.publicKey)

  try {
    if (transaction !== undefined) {
      transaction.update(wallet, recipient, amount)
    } else {
      transaction = wallet.createTransaction(amount, recipient)
    }
  } catch (error) {
    return res.status(400).json({ type: 'error', message: error.message })
  }

  transactionPool.setTransaction(transaction)
  res.json({ transaction })
})

app.get('/api/transaction-pool-map', (req, res) => {
  res.json({
    type: 'success',
    map: Object.fromEntries(transactionPool.transactionMap.entries()),
  })
})
