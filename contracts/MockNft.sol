// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MockNft is ERC721PresetMinterPauserAutoId("MNFT", "Mock NFT", "hhhhhh") {
    function mintWithCount(address to, uint256 count) external {
      for (uint256 i = 0; i < count; i++) {
        mint(to);
      }
    }
}