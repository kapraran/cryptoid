import { STARTING_BALANCE } from '../config'
import { ec } from '../util/ec'

class Wallet {
  public balance: number
  public publicKey: string

  constructor() {
    this.balance = STARTING_BALANCE

    // create a public key
    const keyPair = ec.genKeyPair()
    this.publicKey = keyPair.getPublic().encode('hex', false)
  }
}

export default Wallet
