import crypto from 'crypto'
import { ec } from './ec'

interface VerifySignatureParams {
  publicKey: string
  data: any
  signature: any
}

export const hash = (data: any) => {
  // stringify data
  const str = JSON.stringify(data) + ''

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
  return tempKey.verify(hash(data), signature)
}
