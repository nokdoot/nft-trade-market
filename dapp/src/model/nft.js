import { ethers } from 'ethers';
import { END_POINT_URL } from '../config';

const ABI = [
  'function approve(address _approved, uint256 _tokenId) external payable',
  'function getApproved(uint256 _tokenId) external view returns (address)',
  'function name() external view returns (string _name)',
  'function symbol() external view returns (string _symbol)',
  'function tokenURI(uint256 _tokenId) external view returns (string)',
  'function ownerOf(uint256 _tokenId) external view returns (address)'
]

export const createNftContract = (address) => {
  console.log(address);
  console.log(END_POINT_URL);
  const provider = new ethers.providers.JsonRpcProvider(END_POINT_URL);
  const contract = new ethers.Contract(address, ABI, provider);
  return contract;
}