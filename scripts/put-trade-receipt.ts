import { ethers } from 'hardhat';
import env from 'env-var';

const NFT_TRADE_MARKET_ADDRESS = env.get('NFT_TRADE_MARKET_ADDRESS').required().asString();
const NFT_ADDRESS = env.get('NFT_ADDRESS').required().asString();

(async () => {
  const [admin, test1, test2] = await ethers.getSigners();
  const nftTradeMarket = (await ethers.getContractFactory('NftTradeMarket')).attach(NFT_TRADE_MARKET_ADDRESS);
  const mockNft = (await ethers.getContractFactory('MockNft')).attach(NFT_ADDRESS);

  const givingTokenId = 0;
  const receivingTokenId = 25;
  await (await mockNft.connect(test2).approve(nftTradeMarket.address, 25)).wait();
  await (await mockNft.connect(test2).approve(nftTradeMarket.address, 26)).wait();

  await nftTradeMarket.connect(test2).putTradeReceipt({
    anotherTrader: test1.address,
    givingTokenId: 26,
    nftAddress: NFT_ADDRESS,
    receivingTokenId: 1
  }, {
    value: ethers.utils.parseEther('0.1')
  });

  await nftTradeMarket.connect(test2).putTradeReceipt({
    anotherTrader: test1.address,
    givingTokenId: 25,
    nftAddress: NFT_ADDRESS,
    receivingTokenId: 0
  }, {
    value: ethers.utils.parseEther('0.1')
  });

  // await nftTradeMarket.connect(test1).putTradeReceipt({
  //   anotherTrader: test2.address,
  //   givingTokenId: 1,
  //   nftAddress: NFT_ADDRESS,
  //   receivingTokenId: 26
  // }, {
  //   value: ethers.utils.parseEther('0.1')
  // });
})();