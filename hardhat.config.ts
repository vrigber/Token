import dotenv from "dotenv";
dotenv.config();
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ethers";
import { HDNodeWallet, getAccountPath } from "ethers";

const MNEMONIC = "test test test test test test test test test test test junk";
const DEFAULT_BALANCE = "10000000000000000000";

const defaultAccounts = Array.from({ length: 4 }, (_, i) => {
  const path = getAccountPath(i);
  const wallet = HDNodeWallet.fromPhrase(MNEMONIC, "", path);
  return { privateKey: wallet.privateKey, balance: DEFAULT_BALANCE };
});

const customAccount = process.env.PRIVATE_KEY
  ? [{ privateKey: process.env.PRIVATE_KEY, balance: DEFAULT_BALANCE }]
  : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 500
      }
    }
  },
  networks: {
    hardhat: {
      accounts: [...customAccount, ...defaultAccounts]
    },
    sepolia: {
      url: process.env.RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY as string]
    },
  },
};

export default config;
