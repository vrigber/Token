import { ApproveRequestDto } from './models/ApproveRequestDto'
import { TokenInfoResponseDto } from './models/TokenInfoResponseDto'
import { TransferFromRequestDto } from './models/TransferFromRequestDto'
import { TransferRequestDto } from './models/TransferRequestDto'
import { TxDto } from './models/TxDto'

export interface ITokenService {
  getTokenInfo(token: string): Promise<TokenInfoResponseDto>
  getUserBalance(token: string, owner: string): Promise<string>
  getAllowance(token: string, owner: string, spender: string): Promise<string>
  transfer(token: string, transferRequest: TransferRequestDto): Promise<TxDto>
  approve(token: string, approveRequest: ApproveRequestDto): Promise<TxDto>
  transferFrom(token: string, transferFromRequest: TransferFromRequestDto): Promise<TxDto>
}
