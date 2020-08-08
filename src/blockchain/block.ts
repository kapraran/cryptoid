import { hashBlockData } from './utils'

export const genesisBlockData = {
  data: 'genesis-hello-data',
  timestamp: new Date('Sat Aug 08 2020 00:00:00 GMT+0300').getTime(),
  difficulty: 0,
  nonce: 'no-nonce',
  prevHash: 'no-prev-hash-',
  hash: '',
}

genesisBlockData.hash = hashBlockData(
  genesisBlockData.data,
  genesisBlockData.timestamp,
  genesisBlockData.prevHash,
  genesisBlockData.difficulty,
  genesisBlockData.nonce
)

export class Block {
  public readonly data: any
  public readonly timestamp: number
  public readonly difficulty: number
  public readonly nonce: string
  public readonly prevHash: string
  public readonly hash: string

  constructor(
    data: any,
    timestamp: number,
    difficulty: number,
    nonce: string,
    prevHash: string,
    hash: string
  ) {
    this.data = data
    this.timestamp = timestamp
    this.difficulty = difficulty
    this.nonce = nonce
    this.prevHash = prevHash
    this.hash = hash
  }

  isEqual(anotherBlock: Block): boolean {
    return this.hash == anotherBlock.hash
  }

  isValid(): boolean {
    const validHash = hashBlockData(
      this.data,
      this.timestamp,
      this.prevHash,
      this.difficulty,
      this.nonce
    )
    if (this.hash != validHash) return false

    return true
  }

  static createBlock(
    data: any,
    difficulty: number,
    nonce: string,
    prevHash: string
  ): Block {
    const timestamp = Date.now()
    const hash = hashBlockData(data, timestamp, prevHash, difficulty, nonce)
    return new Block(data, timestamp, difficulty, nonce, prevHash, hash)
  }

  static createGenesis(): Block {
    return new Block(
      genesisBlockData.data,
      genesisBlockData.timestamp,
      genesisBlockData.difficulty,
      genesisBlockData.nonce,
      genesisBlockData.prevHash,
      genesisBlockData.hash
    )
  }
}
