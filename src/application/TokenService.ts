import { IViemRepo } from './IViemRepo'
import { TokenInfoResponseDto } from './models/TokenInfoResponseDto'
import { ITokenService } from './ITokenService'
import { TransferRequestDto } from './models/TransferRequestDto'
import { TxDto } from './models/TxDto'

export class TokenService implements ITokenService {
  constructor(private viemRepo: IViemRepo) { }

  async getTokenInfo(tokenId: string): Promise<TokenInfoResponseDto> {
    const raw = await this.viemRepo.fetchTokenInfo(tokenId)
    return {
      tokenId,
      name: raw.name,
      symbol: raw.symbol,
      decimals: raw.decimals,
      totalSupply: raw.totalSupply.toString(),
    }
  }

  async getUserBalance(tokenId: string, userId: string): Promise<string> {
    const balance = await this.viemRepo.fetchUserBalance(tokenId, userId)
    return balance.toString()
  }

  transfer(
    tokenId: string,
    request: TransferRequestDto
  ): Promise<TxDto> {
    const { sender, recipient, tokenValue } = request
    const amount = BigInt(tokenValue)
    return this.viemRepo.createTransferTransaction(
      tokenId,
      sender,
      recipient,
      amount
    )
  }
}
