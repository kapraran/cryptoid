import Block from '../blockchain/block'
import TransactionPool from '../crypto/transaction-pool'
import Wallet from '../crypto/wallet'
import TransactionMiner from './transaction-miner'

export const generateWallets = (num: number) =>
  new Array(3).fill(null).map((_) => new Wallet())

export const generateWalletTransaction = (
  wallet: Wallet,
  recipient: string,
  amount: number,
  chain: Block[],
  transactionPool: TransactionPool
) => {
  const transaction = wallet.createTransaction(amount, recipient, chain)
  transactionPool.setTransaction(transaction)
}

export const generateSingleTransaction = (
  wallets: Wallet[],
  chain: Block[],
  transactionPool: TransactionPool
) => {
  const len = wallets.length
  const x = Math.floor(Math.random() * len)
  let y = Math.floor(Math.random() * len)

  if (x === y) y = (y + 1) % len

  const walletFrom = wallets[x]
  const walletTo = wallets[y]

  generateWalletTransaction(
    walletFrom,
    walletTo.publicKey,
    parseFloat((Math.random() * 10).toFixed(3)),
    chain,
    transactionPool
  )
}

export const generateTransactionBlocks = (
  blocksNum: number,
  transactionsPerBlock: number,
  wallets: Wallet[],
  chain: Block[],
  transactionPool: TransactionPool,
  miner: TransactionMiner
) => {
  for (let i = 0; i < blocksNum; i++) {
    for (let j = 0; j < transactionsPerBlock; j++) {
      generateSingleTransaction(wallets, chain, transactionPool)
    }

    miner.mineTransactions()
  }
}
