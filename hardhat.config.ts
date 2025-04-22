import dotenv from "dotenv";
dotenv.config();
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ethers";

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
      accounts: process.env.PRIVATE_KEY
      ? [{ privateKey: process.env.PRIVATE_KEY, balance: "1000000000000000000" }]
      : [],
    }
  },
};

export default config;
