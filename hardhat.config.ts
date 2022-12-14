import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "dotenv/config"

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  gasReporter: {
    enabled: true
  },
  networks: {
    baobab: {
      accounts: [
        process.env.PRIVATE_KEY as string,
        process.env.TEST_ADDRESS1_PRIVATE_KEY as string,
        process.env.TEST_ADDRESS2_PRIVATE_KEY as string
      ],
      chainId: 1001,
      // url: 'https://api.baobab.klaytn.net:8651',
      url: 'https://public-node-api.klaytnapi.com/v1/baobab',
    },
    cypress: {
      accounts: [
        process.env.PRIVATE_KEY as string,
        process.env.TEST_ADDRESS1_PRIVATE_KEY as string,
        process.env.TEST_ADDRESS2_PRIVATE_KEY as string
      ],
      chainId: 8217,
      url: 'https://klaytn01.fandom.finance/',
    }
  }
};

export default config;
