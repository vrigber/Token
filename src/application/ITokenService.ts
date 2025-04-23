import { ApproveRequestDto } from './models/ApproveRequestDto'
import { TokenInfoResponseDto } from './models/TokenInfoResponseDto'
import { TransferFromRequestDto } from './models/TransferFromRequestDto'
import { TransferRequestDto } from './models/TransferRequestDto'
import { TxDto } from './models/TxDto'

/**
 * ITokenService
 * 
 * Provides methods to interact with ERC-20 token contracts:
 * fetching metadata, querying balances/allowances, and preparing transactions.
 */
export interface ITokenService {
  /**
   * Fetch basic information about an ERC-20 token.
   * @param token - The ERC-20 contract address.
   * @returns A promise that resolves to the token’s metadata.
   */
  getTokenInfo(token: string): Promise<TokenInfoResponseDto>

  /**
   * Get the token balance for a specific user.
   * @param token - The ERC-20 contract address.
   * @param owner - The user’s wallet address.
   * @returns A promise that resolves to the balance (as a string in smallest unit, wei).
   */
  getUserBalance(token: string, owner: string): Promise<string>

  /**
   * Get the current allowance granted to a spender by an owner.
   * @param token - The ERC-20 contract address.
   * @param owner - The token owner’s wallet address.
   * @param spender - The spender’s wallet address.
   * @returns A promise that resolves to the allowance amount (as a string in smallest unit).
   */
  getAllowance(token: string, owner: string, spender: string): Promise<string>

  /**
   * Build a transaction that transfers tokens from sender to recipient.
   * @param token - The ERC-20 contract address.
   * @param transferRequest - Details of the transfer (sender, recipient, amount).
   * @returns A promise that resolves to a TxDto containing the raw transaction data.
   */
  transfer(token: string, transferRequest: TransferRequestDto): Promise<TxDto>

  /**
   * Build a transaction that approves a spender to transfer tokens on behalf of sender.
   * @param token - The ERC-20 contract address.
   * @param approveRequest - Details of the approval (sender, spender, amount).
   * @returns A promise that resolves to a TxDto containing the raw transaction data.
   */
  approve(token: string, approveRequest: ApproveRequestDto): Promise<TxDto>

  /**
   * Build a transaction that transfers tokens using a prior allowance.
   * @param token - The ERC-20 contract address.
   * @param transferFromRequest - Details of the transferFrom operation (owner, payer, recipient, amount).
   * @returns A promise that resolves to a TxDto containing the raw transaction data.
   */
  transferFrom(token: string, transferFromRequest: TransferFromRequestDto): Promise<TxDto>
}
