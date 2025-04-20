import { ITokenRepo } from './ITokenRepo'
import { TokenInfoDto } from './TokenInfoDto'
import { ITokenService } from './ITokenService'

export class TokenService implements ITokenService {
  constructor(private tokenRepo: ITokenRepo) {}

  async getTokenInfo(tokenId: string): Promise<TokenInfoDto> {
    const raw = await this.tokenRepo.fetchTokenInfo(tokenId)
    return {
      tokenId,
      name: raw.name,
      symbol: raw.symbol,
      decimals: raw.decimals,
      totalSupply: raw.totalSupply.toString(),
    }
  }

  async getUserBalance(tokenId: string, userId: string): Promise<string> {
    const balance = await this.tokenRepo.fetchUserBalance(tokenId, userId)
    return balance.toString()
  }
}
