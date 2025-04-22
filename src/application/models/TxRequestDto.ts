/**
 * Base DTO for transaction parameters
 */
export type TxRequestDto = {
    /** Address initiating the transaction */
    sender: string
  
    /** Transaction nonce of the sender */
    nonce: number
  }