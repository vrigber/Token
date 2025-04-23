/**
 * ApproveRequestDto
 *
 * Request payload to grant allowance of ERC-20 tokens.
 */
export interface ApproveRequestDto {
  /**
   * Address of the token holder who is approving allowance.
   */
  sender: string

  /**
   * Address of the account being approved to spend tokens.
   */
  spender: string

  /**
   * Amount of tokens to approve, in smallest unit (wei).
   */
  tokenValue: string
}
