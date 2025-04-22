import { TokenInfoResponseDto } from './models/TokenInfoResponseDto'
import { TransferRequestDto } from './models/TransferRequestDto'

export interface ITokenService {
  getTokenInfo(tokenId: string): Promise<TokenInfoResponseDto>
  getUserBalance(tokenId: string, userId: string): Promise<string>
  transfer(tokenId: string, transferRequest: TransferRequestDto): Promise<string>
}
