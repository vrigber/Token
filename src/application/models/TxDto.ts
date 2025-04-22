export interface TxDto {
    to: string
    data: string 
    value: string
    nonce: number | null
    gas: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
  }