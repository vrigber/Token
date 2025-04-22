import { TxDto } from "./models/TxDto"

export interface ITxService {
  sendSignedTransaction(signedTx: string): Promise<string>
  getTxStatus(txHash: string): Promise<string>
  signTransaction(tx: TxDto): Promise<string>
}