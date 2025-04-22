import { TokenInfo } from '../domain/TokenInfo'

export interface IViemRepo {
  fetchTokenInfo(tokenAddress: string): Promise<TokenInfo>
  fetchUserBalance(tokenAddress: string, userAddress: string): Promise<bigint>
  createTransferTransaction(tokenId: string, sender: string, nonce: number, recipient: string, amount: bigint): Promise<string>
  sendSignedTransaction(signedTx: string): Promise<string>
  getTxStatus(txHash: string): Promise<string | null>
  signTransaction(rawTx: string): Promise<string>
}