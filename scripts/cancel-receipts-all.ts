import { ethers } from 'hardhat';
import env from 'env-var';

const NFT_TRADE_MARKET_ADDRESS = env.get('NFT_TRADE_MARKET_ADDRESS').required().asString();
const NFT_ADDRESS = env.get('NFT_ADDRESS').required().asString();

(async () => {
  const [admin, test1, test2] = await ethers.getSigners();
  const nftTradeMarket = (await ethers.getContractFactory('NftTradeMarket')).attach(NFT_TRADE_MARKET_ADDRESS);
  const mockNft = (await ethers.getContractFactory('MockNft')).attach(NFT_ADDRESS);

  await nftTradeMarket.connect(test1).cancelReceiptsAll();
})();