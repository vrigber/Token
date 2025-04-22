import { TokenInfo } from '../domain/TokenInfo'
import { TxDto } from './models/TxDto'

export interface IViemRepo {
  fetchTokenInfo(tokenAddress: string): Promise<TokenInfo>
  fetchUserBalance(tokenAddress: string, userAddress: string): Promise<bigint>
  createTransferTransaction(tokenId: string, sender: string, recipient: string, amount: bigint): Promise<TxDto>
  sendSignedTransaction(signedTx: string): Promise<string>
  getTxStatus(txHash: string): Promise<string | null>
  signTransaction(rawTx: TxDto): Promise<string>
}