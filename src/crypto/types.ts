import { ec as EC } from 'elliptic'

// export interface TypicalTransactionInput {
//   timestamp: number
//   address: string
//   amount: number
//   signature: EC.Signature
// }

// export interface RewardTransactionInput {
//   address: string
// }

// export type TransactionInput = TypicalTransactionInput | RewardTransactionInput

export interface TransactionInput {
  address: string
  timestamp?: number
  amount?: number
  signature?: EC.Signature
}

export type OutputMap = { [key: string]: number }

export interface TransactionData {
  id: string
  outputMap: OutputMap
  input: TransactionInput
}
