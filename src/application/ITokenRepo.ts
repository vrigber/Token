import { TokenInfo } from '../domain/TokenInfo'

export interface ITokenRepo {
  fetchTokenInfo(tokenAddress: string): Promise<TokenInfo>
  fetchUserBalance(tokenAddress: string, userAddress: string): Promise<bigint>
}