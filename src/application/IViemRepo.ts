import { TokenInfo } from '../domain/TokenInfo'
import { TxDto } from './models/TxDto'

export interface IViemRepo {
  fetchTokenInfo(token: string): Promise<TokenInfo>
  fetchUserBalance(token: string, owner: string): Promise<bigint>
  createTransferTransaction(token: string, sender: string, recipient: string, amount: bigint): Promise<TxDto>
  sendSignedTransaction(signedTx: string): Promise<string>
  getTxStatus(txHash: string): Promise<string | null>
  signTransaction(rawTx: TxDto): Promise<string>
}