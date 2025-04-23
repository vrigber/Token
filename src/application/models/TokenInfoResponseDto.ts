/**
 * TokenInfoResponseDto
 *
 * Detailed information about an ERC-20 token contract.
 */
export interface TokenInfoResponseDto {
  /**
   * Full name of the token (e.g., "MyToken").
   */
  name: string

  /**
   * Ticker symbol of the token (e.g., "MTK").
   */
  symbol: string

  /**
   * Number of decimal places the token uses.
   */
  decimals: number

  /**
   * Total supply of tokens, in smallest unit (wei).
   */
  totalSupply: string
}
