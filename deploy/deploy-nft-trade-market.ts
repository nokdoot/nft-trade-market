import { ethers } from 'hardhat';
import env from 'env-var';

// const ENV = env.get('ENV').required().asString();
const PUBLIC_KEY = env.get('PUBLIC_KEY').required().asString();

(async () => {
  const NftTradeMarket = await ethers.getContractFactory('NftTradeMarket');
  const nftTradeMarket = await NftTradeMarket.deploy(
    ethers.utils.parseEther('10'),
    PUBLIC_KEY,
  );
  await nftTradeMarket.deployed();
})();