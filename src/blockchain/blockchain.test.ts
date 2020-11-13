import Block from './block'
import Blockchain from './blockchain'
import faker from 'faker'
import { FAKER_SEED } from '../config'
import { hashData } from '../util/utils'

faker.seed(FAKER_SEED)

describe('Blockchain', () => {
  let blockchain: Blockchain

  beforeEach(() => {
    blockchain = new Blockchain()
  })

  it('starts with `genesis` block', () => {
    expect(blockchain.chain[0].isEqual(Block.getGenesis())).toBe(true)
  })

  it('adds a new block to the chain', () => {
    const data = faker.address.streetAddress()
    blockchain.addData(data)

    expect(blockchain.getLastBlock().data).toEqual(data)
  })

  describe('isValid()', () => {
    describe('starts with the genesis block', () => {
      it('returns true', () => {
        expect(blockchain.chain[0].isEqual(Block.getGenesis())).toBe(true)
        expect(Blockchain.isValid(blockchain.chain)).toBe(true)
      })

      it('returns false', () => {
        blockchain.chain[0].data = faker.name.lastName()

        expect(blockchain.chain[0].isEqual(Block.getGenesis())).toBe(false)
        expect(Blockchain.isValid(blockchain.chain)).toBe(false)
      })
    })

    describe('has more than one block', () => {
      beforeEach(() => {
        // add some blocks
        blockchain.addData(faker.company.companyName())
        blockchain.addData(faker.company.companyName())
        blockchain.addData(faker.company.companyName())
      })

      it('returns true if contains only valid blocks', () => {
        expect(Blockchain.isValid(blockchain.chain)).toBe(true)
      })

      describe('and the `prevHash` has changed', () => {
        it('returns false', () => {
          blockchain.getLastBlock().prevHash = faker.random.alphaNumeric(64)
          expect(Blockchain.isValid(blockchain.chain)).toBe(false)
        })
      })

      describe('prevent a difficulty jump', () => {
        it('returns false', () => {
          const prevHash = blockchain.getLastBlock().hash
          const timestamp = Date.now()
          const nonce = 0
          const data = faker.random.word()
          const difficulty = blockchain.getLastBlock().difficulty + 4
          const hash = hashData(data, timestamp, difficulty, nonce, prevHash)

          const badBlock = new Block(
            data,
            timestamp,
            difficulty,
            nonce,
            prevHash,
            hash
          )
          blockchain.chain.push(badBlock)

          expect(Blockchain.isValid(blockchain.chain)).toBe(false)
        })
      })

      describe('and any of the fields has changed', () => {
        it('return false', () => {
          blockchain.getLastBlock().nonce = faker.random.number()
          expect(Blockchain.isValid(blockchain.chain)).toBe(false)
        })

        it('return false', () => {
          blockchain.getLastBlock().hash = faker.random.alphaNumeric(64)
          expect(Blockchain.isValid(blockchain.chain)).toBe(false)
        })
      })
    })
  })

  describe('replaceChain()', () => {
    let originalChain: Block[]
    let newChain: Block[]

    beforeEach(() => {
      originalChain = blockchain.chain

      // create new chain
      const tmp = new Blockchain()
      tmp.addData(faker.name.jobTitle())
      tmp.addData(faker.name.jobTitle())

      newChain = tmp.chain
    })

    describe('when the chain is not longer', () => {
      it('does not replace the chain', () => {
        const wasReplaced = blockchain.replaceChain([
          Block.createBlock(
            faker.name.firstName(),
            0,
            faker.random.number(),
            faker.random.alphaNumeric(16)
          ),
        ])

        expect(wasReplaced).toBe(false)
        expect(blockchain.chain).toEqual(originalChain)
      })
    })

    describe('when the chain is longer', () => {
      it('replaces the chain if it is valid', () => {
        blockchain.replaceChain(newChain)
        expect(blockchain.chain).toEqual(newChain)
      })

      it('does not replaces the chain if it is invalid', () => {
        newChain[1].data = faker.random.word()

        blockchain.replaceChain(newChain)
        expect(blockchain.chain).not.toEqual(newChain)
      })
    })
  })
})
