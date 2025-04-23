import { TokenInfo } from '../domain/TokenInfo'
import { TxDto } from './models/TxDto'

/**
 * IViemRepo
 *
 * Uses Viem to interact with the Ethereum blockchain for ERC-20 operations
 * and raw transaction management.
 */
export interface IViemRepo {
  /**
   * Fetch metadata of an ERC-20 token contract.
   * @param token - The ERC-20 contract address.
   * @returns A promise resolving to {@link TokenInfo}, containing name, symbol, decimals, and totalSupply.
   */
  fetchTokenInfo(token: string): Promise<TokenInfo>

  /**
   * Retrieve the token balance of a user.
   * @param token - The ERC-20 contract address.
   * @param owner - The user’s wallet address.
   * @returns A promise resolving to the balance as a bigint (wei).
   */
  fetchUserBalance(token: string, owner: string): Promise<bigint>

  /**
   * Retrieve the allowance granted by an owner to a spender.
   * @param token - The ERC-20 contract address.
   * @param owner - The owner’s wallet address.
   * @param spender - The spender’s wallet address.
   * @returns A promise resolving to the allowance amount as a bigint (wei).
   */
  fetchAllowance(token: string, owner: string, spender: string): Promise<bigint>

  /**
   * Build a transaction that transfers tokens from sender to recipient.
   * @param token - The ERC-20 contract address.
   * @param sender - Address sending the tokens.
   * @param recipient - Address receiving the tokens.
   * @param amount - Amount of tokens to transfer, in wei.
   * @returns A promise resolving to a {@link TxDto} containing the raw transaction data.
   */
  createTransferTransaction(
    token: string,
    sender: string,
    recipient: string,
    amount: bigint
  ): Promise<TxDto>

  /**
   * Build a transaction that approves a spender to transfer tokens on behalf of the sender.
   * @param token - The ERC-20 contract address.
   * @param sender - Address granting the allowance.
   * @param spender - Address being approved to spend tokens.
   * @param amount - Amount to approve, in wei.
   * @returns A promise resolving to a {@link TxDto} containing the raw transaction data.
   */
  createApproveTransaction(
    token: string,
    sender: string,
    spender: string,
    amount: bigint
  ): Promise<TxDto>

  /**
   * Build a transaction that transfers tokens using an existing allowance.
   * @param token - The ERC-20 contract address.
   * @param sender - Address of the owner who granted allowance.
   * @param payer - Address paying the gas fees.
   * @param recipient - Address receiving the tokens.
   * @param amount - Amount to transfer, in wei.
   * @returns A promise resolving to a {@link TxDto} containing the raw transaction data.
   */
  createTransferFromTransaction(
    token: string,
    sender: string,
    payer: string,
    recipient: string,
    amount: bigint
  ): Promise<TxDto>

  /**
   * Broadcast a signed transaction to the Ethereum network.
   * @param signedTx - Hex-encoded signed transaction data.
   * @returns A promise resolving to the transaction hash.
   */
  sendSignedTransaction(signedTx: string): Promise<string>

  /**
   * Check the status of a submitted transaction.
   * @param txHash - The hash of the transaction to query.
   * @returns A promise resolving to the transaction status (e.g., "pending", "confirmed", "failed")
   *          or `null` if the transaction is not found.
   */
  getTxStatus(txHash: string): Promise<string | null>

  /**
   * Sign a raw Ethereum transaction payload.
   * @param rawTx - The raw transaction object; all numeric fields (value, gas, fees) are in wei.
   * @returns A promise resolving to the hex-encoded signed transaction.
   */
  signTransaction(rawTx: TxDto): Promise<string>
}
