const Block = require('../lib/block')
const chai = require('chai')

const should = chai.should()

describe('Block', () => {
  it('create an instance of block', () => {
    const block = Block('', 123, 'ashd', 'asda')
  })
})