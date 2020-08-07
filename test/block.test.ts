import {Block} from '../lib/block'
import faker from 'faker'

faker.seed(1911)

describe('Block', () => {
  it('create an instance of block', () => {
    const data = faker.name.firstName()
    const timestamp = Date.now()
    const hash = faker.random.alphaNumeric(64)
    const prevHash = faker.random.alphaNumeric(64)
    const difficulty = 0
    const nonce = faker.random.alphaNumeric(64)

    const block = new Block(data, timestamp, hash, prevHash, difficulty, nonce)

    expect(block.data).toEqual(data)
    expect(block.timestamp).toEqual(timestamp)
    expect(block.hash).toEqual(hash)
    expect(block.prevHash).toEqual(prevHash)
    expect(block.difficulty).toEqual(difficulty)
    expect(block.nonce).toEqual(nonce)
  })
})