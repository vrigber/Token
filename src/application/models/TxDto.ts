/**
 * TxDto
 *
 * Representation of a raw Ethereum transaction.
 */
export interface TxDto {
  /**
   * Contract or account address to send the transaction to.
   */
  to: string

  /**
   * Encoded function call data payload.
   */
  data: string

  /**
   * ETH value to send with the transaction, in wei.
   */
  value: string

  /**
   * Transaction count of sender; null to auto-determine.
   */
  nonce: number | null

  /**
   * Gas limit for the transaction, in units of gas.
   */
  gas: string

  /**
   * Maximum fee per gas unit willing to pay (EIP-1559), in wei.
   */
  maxFeePerGas: string

  /**
   * Maximum priority fee per gas unit (miner tip), in wei.
   */
  maxPriorityFeePerGas: string
}