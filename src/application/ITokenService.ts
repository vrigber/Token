import { TokenInfoDto } from './TokenInfoDto'

export interface ITokenService {
  getTokenInfo(tokenId: string): Promise<TokenInfoDto>
  getUserBalance(tokenId: string, userId: string): Promise<string>
}
