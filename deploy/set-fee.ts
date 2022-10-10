import { ethers } from 'hardhat';
import env from 'env-var';
import { MockNft__factory } from '../typechain-types';

const NFT_TRADE_MARKET_ADDRESS = env.get('NFT_TRADE_MARKET_ADDRESS').required().asString();

(async () => {
  const [owner] = await ethers.getSigners();
  const nftTradeMarket = (await ethers.getContractFactory('NftTradeMarket')).attach(NFT_TRADE_MARKET_ADDRESS);

  await nftTradeMarket.connect(owner).setFee(
    ethers.utils.parseEther('0.1')
  )
})();