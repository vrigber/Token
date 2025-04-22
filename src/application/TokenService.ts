import { IViemRepo } from './IViemRepo'
import { TokenInfoResponseDto } from './models/TokenInfoResponseDto'
import { ITokenService } from './ITokenService'
import { TransferRequestDto } from './models/TransferRequestDto'
import { TxDto } from './models/TxDto'

export class TokenService implements ITokenService {
  constructor(private viemRepo: IViemRepo) { }

  async getTokenInfo(token: string): Promise<TokenInfoResponseDto> {
    const raw = await this.viemRepo.fetchTokenInfo(token)
    return {
      name: raw.name,
      symbol: raw.symbol,
      decimals: raw.decimals,
      totalSupply: raw.totalSupply.toString(),
    }
  }

  async getUserBalance(token: string, owner: string): Promise<string> {
    const balance = await this.viemRepo.fetchUserBalance(token, owner)
    return balance.toString()
  }
  
  getAllowance(token: string, owner: string, spender: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  transfer(
    token: string,
    request: TransferRequestDto
  ): Promise<TxDto> {
    const { sender, recipient, tokenValue } = request
    const amount = BigInt(tokenValue)
    return this.viemRepo.createTransferTransaction(
      token,
      sender,
      recipient,
      amount
    )
  }
}
