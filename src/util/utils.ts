import crypto from 'crypto'
import { ec } from './ec'

//@ts-ignore
import hexToBinary from 'hex-to-binary'

interface VerifySignatureParams {
  publicKey: string
  data: any
  signature: any
}

export const hashData = (...inputs: any[]) => {
  // stringify data
  const str = inputs
    .map((item) => JSON.stringify(item) + '')
    .sort()
    .join('|')

  // convert to a sha265 hash
  const sha256 = crypto.createHash('sha256')
  return sha256.update(str).digest('hex')
}

export const verifySignature = ({
  publicKey,
  data,
  signature,
}: VerifySignatureParams) => {
  const tempKey = ec.keyFromPublic(publicKey, 'hex')
  return tempKey.verify(hashData(data), signature)
}

export const satisfiesDifficulty = (hash: string, difficulty: number) => {
  return hash.substring(0, difficulty) === '0'.repeat(difficulty)
}
