import { Block } from './block'

const block1 = new Block(
  [3, 4],
  Date.now(),
  'some-hash-1',
  'some-hash-2',
  0,
  ''
)
const block2 = new Block(
  [1, 2],
  Date.now(),
  'some-hash-3',
  'some-hash-4',
  0,
  ''
)

console.log(block1)
console.log(block2)
