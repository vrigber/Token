/**
 * TransferFromRequestDto
 *
 * Request payload to transfer tokens using an existing allowance.
 */
export interface TransferFromRequestDto {
    /**
     * Address of the token owner who granted allowance.
     */
    sender: string
  
    /**
     * Address of the account paying gas fees.
     */
    payer: string
  
    /**
     * Address of the account receiving tokens.
     */
    recipient: string
  
    /**
     * Amount of tokens to transfer, in smallest unit (wei).
     */
    tokenValue: string
  }
  