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
})
