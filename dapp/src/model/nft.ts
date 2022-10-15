import { ethers } from 'ethers';

// const END_POINT_URL = 'https://public-node-api.klaytnapi.com/v1/baobab';
const END_POINT_URL = 'https://klaytn01.fandom.finance/';

const ABI = [
  'function approve(address _approved, uint256 _tokenId) external payable',
  'function getApproved(uint256 _tokenId) external view returns (address)',
  'function name() external view returns (string _name)',
  'function symbol() external view returns (string _symbol)',
  'function tokenURI(uint256 _tokenId) external view returns (string)',
  'function ownerOf(uint256 _tokenId) external view returns (address)'
]

export const createNftContract = (address: string) => {
  console.log(address);
  const provider = new ethers.providers.JsonRpcProvider(END_POINT_URL);
  const contract = new ethers.Contract(address, ABI, provider);
  return contract;
}