import { verifySignature } from '../util/utils'
import Wallet from './wallet'

describe('Wallet', () => {
  let wallet: Wallet

  beforeEach(() => {
    wallet = new Wallet()
  })

  it('has a balance', () => {
    expect(wallet).toHaveProperty('balance')
  })

  it('has a public key', () => {
    expect(wallet).toHaveProperty('publicKey')
  })

  describe('signing data', () => {
    const data = 'Hello World!'

    it('verifies a valid signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        })
      ).toBe(true)
    })

    it('does not verify an invalid signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        })
      ).toBe(false)
    })
  })
})
