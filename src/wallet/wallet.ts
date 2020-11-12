import { ec as EC } from 'elliptic'
import { STARTING_BALANCE } from '../config'
import { ec } from '../util/ec'
import { hash } from '../util/utils'

class Wallet {
  public balance: number
  private keyPair: EC.KeyPair
  public publicKey: string

  constructor() {
    this.balance = STARTING_BALANCE

    // create a public key
    this.keyPair = ec.genKeyPair()
    this.publicKey = this.keyPair.getPublic().encode('hex', false)
  }

  sign(data: any) {
    return this.keyPair.sign(hash(data))
  }

  static createTransaction() {}
}

export default Wallet
