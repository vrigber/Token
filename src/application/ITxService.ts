import { TxDto } from "./models/TxDto"

/**
 * ITxService
 *
 * Provides methods to sign, send and query Ethereum transactions.
 */
export interface ITxService {
  /**
   * Broadcast a signed Ethereum transaction to the network.
   * @param signedTx - Hex-encoded signed transaction data.
   * @returns A promise that resolves to the transaction hash.
   */
  sendSignedTransaction(signedTx: string): Promise<string>

  /**
   * Query the status of a submitted transaction.
   * @param txHash - Hash of the transaction to query.
   * @returns A promise that resolves to the transaction status (e.g., "pending", "confirmed", "failed").
   */
  getTxStatus(txHash: string): Promise<string>

  /**
   * Sign a raw Ethereum transaction payload.
   * @param tx - The raw transaction object. All numeric fields (value, gas, fees) are in wei.
   * @returns A promise that resolves to the hex-encoded signed transaction.
   */
  signTransaction(tx: TxDto): Promise<string>
}