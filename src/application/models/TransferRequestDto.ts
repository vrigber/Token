/**
 * DTO for token transfer, includes recipient and token amount
 */
export interface TransferRequestDto {
  sender: string
  /** Address of the recipient */
  recipient: string

  /** Token value to transfer in smallest unit */
  tokenValue: string
}