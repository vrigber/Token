/**
 * TransferRequestDto
 *
 * Request payload to transfer ERC-20 tokens directly.
 */
export interface TransferRequestDto {
  /**
   * Address of the token sender.
   */
  sender: string

  /**
   * Address of the token recipient.
   */
  recipient: string

  /**
   * Amount of tokens to transfer, in smallest unit (wei).
   */
  tokenValue: string
}
