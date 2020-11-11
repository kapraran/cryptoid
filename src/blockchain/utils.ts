import crypto from 'crypto'

export const hashBlockData = (
  data: any,
  timestamp: number,
  prevHash: string,
  difficulty: number,
  nonce: string
): string => {
  const str = [data, timestamp, prevHash, difficulty, nonce]
    .map((item: any) => JSON.stringify(item) + '')
    .sort()
    .reduce((acc: string, item: string) => acc + item, '')

  const sha256 = crypto.createHash('sha256')
  return sha256.update(str).digest('hex')
}

export const mineBlock = (): void => {}