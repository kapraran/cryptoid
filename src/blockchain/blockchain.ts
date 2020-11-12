import Block from './block'

class Blockchain {
  private chain: Block[]

  constructor() {
    this.chain = [Block.getGenesis()]
  }

  addData(data: any) {
    const difficulty = 0
    const nonce = 'abc'
    const prevHash = this.getLastBlock().hash

    const block = Block.createBlock(data, difficulty, nonce, prevHash)
    this.chain.push(block)
  }

  isValid(): boolean {
    return false
  }

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1]
  }
}

export default Blockchain
