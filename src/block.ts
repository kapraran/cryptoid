class Block {
  public readonly data: any
  public readonly timestamp: number
  public readonly hash: string
  public readonly prevHash: string

  /**
   * 
   * @param data 
   * @param timestamp 
   * @param hash 
   * @param prevHash 
   */
  constructor(data: any, timestamp: number, hash: string, prevHash: string) {
    this.data = data
    this.timestamp = timestamp
    this.hash = hash
    this.prevHash = prevHash
  }

  /**
   * 
   * @param data 
   * @param prevBlock 
   */
  static createBlock(data: any, prevBlock: Block) {
    const hash = ''
    return new Block(data, Date.now(), hash, prevBlock.hash)
  }

  /**
   * 
   */
  static genesis() {

  }
}

export default Block
