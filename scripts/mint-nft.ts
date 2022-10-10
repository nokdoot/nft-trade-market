import { ethers } from 'hardhat';
import env from 'env-var';
import { MockNft__factory } from '../typechain-types';

const NFT_ADDRESS = env.get('NFT_ADDRESS').required().asString();
const TEST_ADDRESS1 = env.get('TEST_ADDRESS1').required().asString();
const TEST_ADDRESS2 = env.get('TEST_ADDRESS2').required().asString();
const PUBLIC_KEY = env.get('PUBLIC_KEY').required().asString();

(async () => {
  const [owner] = await ethers.getSigners();
  const nft = (await ethers.getContractFactory('MockNft')).attach(NFT_ADDRESS);
  for (let i = 17; i < 25; i++) {
    await nft.connect(owner).mint(TEST_ADDRESS1, i, {
      gasLimit: 300000
    });
  }

  for (let i = 25; i < 50; i++) {
    await nft.connect(owner).mint(TEST_ADDRESS2, i, {
      gasLimit: 300000
    });
  }
})();