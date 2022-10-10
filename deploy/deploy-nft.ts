import { ethers } from 'hardhat';
import env from 'env-var';

// const ENV = env.get('ENV').required().asString();
// const PUBLIC_KEY = env.get('PUBLIC_KEY').required().asString();

(async () => {
  const [owner] = await ethers.getSigners();
  const MockNft = await ethers.getContractFactory('MockNft');
  const mockNft = await MockNft.deploy();
  await mockNft.deployed();
  console.log('mockNft:', mockNft.address);
})();