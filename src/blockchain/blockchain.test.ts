import Block from './block'
import Blockchain from './blockchain'
import faker from 'faker'
import { FAKER_SEED } from '../config'

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
        expect(Blockchain.isValid(blockchain)).toBe(true)
      })

      it('returns false', () => {
        blockchain.chain[0].data = faker.name.lastName()

        expect(blockchain.chain[0].isEqual(Block.getGenesis())).toBe(false)
        expect(Blockchain.isValid(blockchain)).toBe(false)
      })
    })

    describe('has more than one block', () => {
      let newData: string

      beforeEach(() => {
        // add some blocks
        blockchain.addData(faker.company.companyName())
        blockchain.addData(faker.company.companyName())
        blockchain.addData(faker.company.companyName())
      })

      it('returns true if contains only valid blocks', () => {
        expect(Blockchain.isValid(blockchain)).toBe(true)
      })

      describe('and the `prevHash` has changed', () => {
        it('returns false', () => {
          blockchain.getLastBlock().prevHash = faker.random.alphaNumeric(64)
          expect(Blockchain.isValid(blockchain)).toBe(false)
        })
      })

      describe('and any of the fields has changed', () => {
        it('return false', () => {
          blockchain.getLastBlock().nonce = faker.random.alphaNumeric(16)
          expect(Blockchain.isValid(blockchain)).toBe(false)
        })

        it('return false', () => {
          blockchain.getLastBlock().hash = faker.random.alphaNumeric(64)
          expect(Blockchain.isValid(blockchain)).toBe(false)
        })
      })
    })
  })

  describe('replaceChain()', () => {
    
  })
})
