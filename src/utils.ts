import crypto from 'crypto'

export const hashBlockData = (data: any, timestamp: number, prevHash: string, difficulty: number, nonce: string): string => {
  const str = [data, timestamp, prevHash, difficulty, nonce].reduce((acc, item) => {
    acc += (JSON.stringify(item) + '')
    return acc
  }, '')
  
  const sha256 = crypto.createHash('sha256')
  return sha256.update(str).digest('hex')
}

export const mineBlock = (): void => {

}
