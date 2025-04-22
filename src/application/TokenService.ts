import { IViemRepo } from './IViemRepo'
import { TokenInfoResponseDto } from './models/TokenInfoResponseDto'
import { ITokenService } from './ITokenService'
import { TransferRequestDto } from './models/TransferRequestDto'
import { TxDto } from './models/TxDto'
import { ApproveRequestDto } from './models/ApproveRequestDto'
import { TransferFromRequestDto } from './models/TransferFromRequestDto'

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

  async getAllowance(token: string, owner: string, spender: string): Promise<string> {
    const allowance = await this.viemRepo.fetchAllowance(token, owner, spender)
    return allowance.toString()
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

  approve(token: string, approveRequest: ApproveRequestDto): Promise<TxDto> {
    const { sender, spender, tokenValue } = approveRequest
    const amount = BigInt(tokenValue)
    return this.viemRepo.createApproveTransaction(
      token,
      sender,
      spender,
      amount
    )
  }
  transferFrom(token: string, transferFromRequest: TransferFromRequestDto): Promise<TxDto> {
    const { sender, payer, recipient, tokenValue } = transferFromRequest
    const amount = BigInt(tokenValue)
    return this.viemRepo.createTransferFromTransaction(
      token,
      sender,
      payer,
      recipient,
      amount
    )
  }
}
