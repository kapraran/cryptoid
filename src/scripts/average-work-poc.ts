import Blockchain from '../blockchain/blockchain'

const blockchain = new Blockchain()
blockchain.addData(`block -> INITIAL`)

console.log('first block', blockchain.getLastBlock())

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average
const times = []

for (let i = 0; i < 10000; i++) {
  prevTimestamp = blockchain.getLastBlock().timestamp
  nextBlock = blockchain.addData(`block -> ${i}`)

  // time diffence
  nextTimestamp = nextBlock.timestamp
  timeDiff = nextTimestamp - prevTimestamp
  times.push(timeDiff)

  // calculate average time to mine
  average = times.reduce((total, num) => total + num) / times.length

  console.log(
    `Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms`
  )
}
