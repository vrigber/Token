import { TxRequestDto } from './TxRequestDto'
/**
 * DTO for token transfer, includes recipient and token amount
 */
export interface TransferRequestDto extends TxRequestDto {
  /** Address of the recipient */
  recipient: string

  /** Token value to transfer in smallest unit */
  tokenValue: string
}