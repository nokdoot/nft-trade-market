import { ethers } from 'hardhat';
import env from 'env-var';
import { MockNft__factory } from '../typechain-types';

const NFT_ADDRESS = env.get('NFT_ADDRESS').required().asString();
const TEST_ADDRESS1 = env.get('TEST_ADDRESS1').required().asString();
const TEST_ADDRESS2 = env.get('TEST_ADDRESS2').required().asString();

(async () => {
  const [owner] = await ethers.getSigners();
  const nft = (await ethers.getContractFactory('MockNft')).attach(NFT_ADDRESS);

  // await nft.mintWithCount(TEST_ADDRESS1, 25);
  // await nft.mintWithCount(TEST_ADDRESS2, 25);
})();