export class Block {
  public readonly data: any
  public readonly timestamp: number
  public readonly difficulty: number
  public readonly nonce: string
  public readonly prevHash: string
  public readonly hash: string

  constructor(data: any, timestamp: number, hash: string, prevHash: string, difficulty: number, nonce: string) {
    this.data = data
    this.timestamp = timestamp
    this.difficulty = difficulty
    this.nonce = nonce
    this.prevHash = prevHash
    this.hash = hash
  }

  static createBlock(data: any, prevBlock: Block): Block {
    const hash = ''
    return new Block(data, Date.now(), hash, prevBlock.hash, 0, '')
  }

  static createGenesis(): Block {
    return new Block('', 0, '', '', 0, '')
  }
}
