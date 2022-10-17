import NftTradeMarket from '../../../artifacts/contracts/NftTradeMarket.sol/NftTradeMarket.json';
export const NFT_TRADE_MARKET_ABI = NftTradeMarket.abi;

export const END_POINT_URL = import.meta.env.VITE_END_POINT_URL;
export const NFT_TRADE_MARKET_ADDRESS = import.meta.env.VITE_NFT_TRADE_MARKET_ADDRESS;
export const PROXY_SERVER_URL = import.meta.env.VITE_PROXY_SERVER_URL;
export const CHAIN_ID = import.meta.env.VITE_CHAIN_ID;
export const FEE = import.meta.env.VITE_FEE;
export const COIN = import.meta.env.VITE_COIN;

export const ERC721_ABI = [{
  "inputs": [
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "name": "approve",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "name": "getApproved",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}];