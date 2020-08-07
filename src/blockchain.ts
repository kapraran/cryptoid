import { Block } from './block'

export class Blockchain {
  private chain: Block[]
  
  constructor() {
    this.chain = [Block.createGenesis()]
  }

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }
}
