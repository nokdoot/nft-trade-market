import NftTradeMarket from '../../../artifacts/contracts/NftTradeMarket.sol/NftTradeMarket.json';

// export const END_POINT_URL = 'https://api.baobab.klaytn.net:8651';
export const END_POINT_URL = 'https://public-node-api.klaytnapi.com/v1/baobab';
// export const END_POINT_URL = 'https://klaytn01.fandom.finance/';
export const NFT_TRADE_MARKET_ADDRESS = '0xf451825677d43dFfd7F30cda81745E2E16D057bb';
export const NFT_TRADE_MARKET_ABI = NftTradeMarket.abi;
// export const PROXY_SERVER_URL = 'https://nft-trade-market.which-villain.com';
export const PROXY_SERVER_URL = 'http://localhost:3000';

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