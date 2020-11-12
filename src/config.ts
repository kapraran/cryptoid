export const MINE_RATE = 1000
export const INITIAL_DIFFICULTY = 3
export const STARTING_BALANCE = 1000.0

export const GENESIS_DATA = {
  data: 'genesis-block-data',
  timestamp: new Date('Sat Aug 01 2020 00:00:00 GMT+0300').getTime(),
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  prevHash: 'no-prev-hash',
  hash: '',
}

// used for testing
export const FAKER_SEED = 2020
