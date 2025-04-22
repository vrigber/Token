import { IViemRepo } from './IViemRepo'
import { ITxService } from './ITxService'

export class TxService implements ITxService {
  constructor(private viemRepo: IViemRepo) { }

  async sendSignedTransaction(signedTx: string): Promise<string> {
    const txHash = await this.viemRepo.sendSignedTransaction(signedTx)
    return txHash
  }

  async getTxStatus(txHash: string): Promise<string> {
    const status = await this.viemRepo.getTxStatus(txHash)
    if (!status) {
      return 'Pending'
    }
    return status
  }

  signTransaction(rawTx: string): Promise<string> {
    return this.viemRepo.signTransaction(rawTx)
  }
}
