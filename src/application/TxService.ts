import { IViemRepo } from './IViemRepo'
import { ITxService } from './ITxService'
import { TxDto } from './models/TxDto'

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

  signTransaction(tx: TxDto): Promise<string> {
    return this.viemRepo.signTransaction(tx)
  }
}
