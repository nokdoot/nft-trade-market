import { ethers } from 'hardhat';
import env from 'env-var';

const NFT_TRADE_MARKET_ADDRESS = env.get('NFT_TRADE_MARKET_ADDRESS').required().asString();
const NFT_ADDRESS = env.get('NFT_ADDRESS').required().asString();

(async () => {
  const [admin, test1, test2] = await ethers.getSigners();
  const nftTradeMarket = (await ethers.getContractFactory('NftTradeMarket')).attach(NFT_TRADE_MARKET_ADDRESS);
  const mockNft = (await ethers.getContractFactory('MockNft')).attach(NFT_ADDRESS);

  await nftTradeMarket.connect(test1).cancelTradeReceipt('0xac62dc5f49362863683798b7dff37f731df24551cb435c6ed8ed3966abd19379');
})();