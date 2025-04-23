/**
 * TokenInfo
 *
 * Represents basic metadata of an ERC-20 token.
 */
export interface TokenInfo {
  /**
   * Full name of the token (e.g., "MyToken").
   */
  name: string

  /**
   * Ticker symbol of the token (e.g., "MTK").
   */
  symbol: string

  /**
   * Total supply of the token, as a bigint in smallest unit (wei).
   */
  totalSupply: bigint

  /**
   * Number of decimal places the token uses.
   */
  decimals: number
}