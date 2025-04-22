export interface ITxService {
  sendSignedTransaction(signedTx: string): Promise<string>
  getTxStatus(txHash: string): Promise<string>
  signTransaction(rawTx: string): Promise<string>
}