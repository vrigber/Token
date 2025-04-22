import { IViemRepo } from "../application/IViemRepo";
import { TokenInfo } from "../domain/TokenInfo";
import {
  createPublicClient,
  http,
  isAddress,
  encodeFunctionData,
  createWalletClient,
  parseGwei,
  type Address,
  type PublicClient,
  type Chain,
  type Hex,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { erc20Abi } from 'viem'
import * as chains from 'viem/chains'
import { TxDto } from "../application/models/TxDto";


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

  fetchAllowance(token: string, owner: string, spender: string): Promise<bigint> {
    const tokenAddress = this.parseAddress(token)
    const ownerAddress = this.parseAddress(owner)
    const spenderAddress = this.parseAddress(spender)

    return this.client.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [ownerAddress, spenderAddress],
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
    senderStr: string,
    recipientStr: string,
    amount: bigint
  ): Promise<TxDto> {
    const from = this.parseAddress(senderStr)
    const to = this.parseAddress(tokenAddress)
    const recipient = this.parseAddress(recipientStr)

    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient, amount],
    })
    return this.prepareTransaction(from, to, data)
  }

  async createApproveTransaction(token: string, sender: string, spender: string, amount: bigint): Promise<TxDto> {
    const tokenAddress = this.parseAddress(token)
    const senderAddress = this.parseAddress(sender)
    const spenderAddress = this.parseAddress(spender)

    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [spenderAddress, amount],
    })
    return this.prepareTransaction(senderAddress, tokenAddress, data)
  }

  createTransferFromTransaction(token: string, sender: string, payer: string, recipient: string, amount: bigint): Promise<TxDto> {
    const tokenAddress = this.parseAddress(token)
    const senderAddress = this.parseAddress(sender)
    const payerAddress = this.parseAddress(payer)
    const recipientAddress = this.parseAddress(recipient)

    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transferFrom',
      args: [payerAddress, recipientAddress, amount],
    })

    return this.prepareTransaction(senderAddress, tokenAddress, data)
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
      txHash.startsWith('0x')
        ? txHash
        : `0x${txHash}`
    ) as Hex

    try {
      const receipt = await this.client.getTransactionReceipt({ hash })
      return receipt.status
    } catch (error) {
      if (error instanceof Error && error.name === "TransactionReceiptNotFoundError") {
        return null;
      }
      throw error
    }
  }

  async signTransaction(tx: TxDto): Promise<string> {
    const priv = process.env.PRIVATE_KEY
    if (!priv) throw new Error('PRIVATE_KEY not set in env')
    const privHex = priv.startsWith('0x') ? priv : `0x${priv}`
    const account = privateKeyToAccount(privHex as Hex)

    const walletClient = createWalletClient({
      account,
      chain: this.client.chain,
      transport: http(this.client.transport.url),
    })

    const preparedTx = {
      to: tx.to as `0x${string}`,
      data: tx.data as `0x${string}`,
      value: BigInt(tx.value),
      nonce: tx.nonce ?? await this.client.getTransactionCount({ address: account.address }),
      gas: BigInt(tx.gas),
      maxFeePerGas: BigInt(tx.maxFeePerGas),
      maxPriorityFeePerGas: BigInt(tx.maxPriorityFeePerGas),
      chain: this.client.chain,
    }

    const signedHex = await walletClient.signTransaction(preparedTx)
    return signedHex
  }

  private async prepareTransaction(account: `0x${string}`, to: `0x${string}`, data: `0x${string}`): Promise<TxDto> {
    if (!this.client.chain) {
      throw new Error('Chain is not set')
    }

    const estimatedGas = await this.client.estimateGas({
      account,
      to,
      data
    })

    const gas = estimatedGas / 10n + estimatedGas;
    const maxFeePerGas = parseGwei('20')
    const maxPriorityFeePerGas = parseGwei('2')
    return {
      to,
      data,
      nonce: null,
      value: '0',
      gas: gas.toString(),
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString()
    }
  }

  private parseAddress(addressStr: string): Address {
    if (!isAddress(addressStr)) {
      throw new Error(`Invalid address: ${addressStr}`)
    }
    return addressStr as Address
  }
}