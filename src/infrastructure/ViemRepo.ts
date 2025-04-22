import { IViemRepo } from "../application/IViemRepo";
import { TokenInfo } from "../domain/TokenInfo";
import { 
  createPublicClient, 
  http, 
  isAddress, 
  encodeFunctionData, 
  serializeTransaction, 
  parseTransaction, 
  createWalletClient,
  type Address, 
  type PublicClient, 
  type Chain,
  type Hex
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { erc20Abi } from 'viem'
import * as chains from 'viem/chains'


export class ViemRepo implements IViemRepo {
  private client: PublicClient
    
  constructor(rpcUrl?: string, chainName?: string) {
    const url = rpcUrl ?? 'http://127.0.0.1:8545'
    const key = (chainName ?? 'hardhat').toLowerCase()
    const rawChain = (chains as any)[key]
    if (!rawChain) {
      throw new Error(`Unsupported chain: ${chainName ?? 'hardhat'}`)
    }
    const chain = rawChain as Chain

    this.client = createPublicClient({
      chain,
      transport: http(url),
    })
  }

  async fetchTokenInfo(tokenAddressStr: string): Promise<TokenInfo> {
    const address = this.parseAddress(tokenAddressStr)
    const [name, symbol, totalSupply, decimals] = await Promise.all([
      this.client.readContract({ address, abi: erc20Abi, functionName: 'name' }),
      this.client.readContract({ address, abi: erc20Abi, functionName: 'symbol' }),
      this.client.readContract({ address, abi: erc20Abi, functionName: 'totalSupply' }),
      this.client.readContract({ address, abi: erc20Abi, functionName: 'decimals' }),
    ])
    return { name, symbol, totalSupply, decimals }
  }
  
  fetchUserBalance(tokenAddressStr: string, userAddressStr: string) {
    const address = this.parseAddress(tokenAddressStr)
    const userAddress = this.parseAddress(userAddressStr)
    return this.client.readContract({
      address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [userAddress],
  })
  }

  async createTransferTransaction(
    tokenAddress: string,
    sender: string,
    nonce: number,
    recipientStr: string,
    amount: bigint
  ): Promise<string> {
    const to = this.parseAddress(tokenAddress)
    const from = this.parseAddress(sender)
    const recipient = this.parseAddress(recipientStr)
  
    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient, amount],
    })

    if (!this.client.chain) {
      throw new Error('Chain is not set')
    }

    const chainId = this.client.chain.id;  
    const estimatedGas = await this.client.estimateGas({
      to,
      account: from,
      data,
      nonce
    })

    const gasLimit = estimatedGas / 10n + estimatedGas
    const gasPrice = await this.client.getGasPrice();
    const tx = { to, from, data, nonce, chainId, gasLimit, gasPrice }
  
    const rawTx = serializeTransaction(tx)
    return rawTx
  }

  async sendSignedTransaction(signedTx: string): Promise<string> {
    const serializedTransaction = (
      signedTx.startsWith('0x') 
        ? signedTx 
        : `0x${signedTx}`
    ) as Hex
    return this.client.sendRawTransaction({
      serializedTransaction
    })
  }

  async getTxStatus(txHash: string): Promise<string | null> {
    const hash = (
      txHash
        ? txHash 
        : `0x${txHash}`
    ) as Hex
    const receipt = await this.client.getTransactionReceipt({ hash })
    if (!receipt) return null
    return receipt.status
  }

  async signTransaction(rawTx: string): Promise<string> {
    const txHex = rawTx.startsWith('0x') ? rawTx : `0x${rawTx}`
    const parsed = parseTransaction(txHex as Hex)

    const priv = process.env.PRIVATE_KEY
    if (!priv) throw new Error('PRIVATE_KEY not set in env')
    const privHex = priv.startsWith('0x') ? priv : `0x${priv}`
    const account = privateKeyToAccount(privHex as Hex)

    const walletClient = createWalletClient({
      account,
      chain:     this.client.chain,
      transport: http(this.client.transport.url),
    })

    const compatibleTx = {
      to: parsed.to,
      data: parsed.data,
      gas: parsed.gas,
      gasPrice: parsed.gasPrice,
      nonce: parsed.nonce,
      value: parsed.value,
      chainId: parsed.chainId,
      chain: this.client.chain,
    }
    const signedHex = await walletClient.signTransaction(compatibleTx)
    return signedHex
  }

  private parseAddress(addressStr: string): Address {
    if (!isAddress(addressStr)) {
      throw new Error(`Invalid address: ${addressStr}`)
    }
    return addressStr as Address
  }
}