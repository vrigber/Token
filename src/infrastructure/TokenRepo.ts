import { ITokenRepo } from "../application/ITokenRepo";
import { TokenInfo } from "../domain/TokenInfo";
import { createPublicClient, http, isAddress, type Address } from 'viem'
import { erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'


export class TokenRepo implements ITokenRepo {
    private client = createPublicClient({
        chain: mainnet,
        transport: http(process.env.RPC_URL!),
      })
    
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
      
      async fetchUserBalance(tokenAddressStr: string, userAddressStr: string) {
        const address = this.parseAddress(tokenAddressStr)
        const userAddress = this.parseAddress(userAddressStr)
        const balance = await this.client.readContract({
            address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [userAddress],
        })
        return balance
      }

      private parseAddress(addressStr: string): Address {
        if (!isAddress(addressStr)) {
          throw new Error(`Invalid address: ${addressStr}`)
        }
        return addressStr as Address
      }
  }