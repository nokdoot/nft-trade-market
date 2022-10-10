// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@klaytn/contracts/KIP/token/KIP17/KIP17.sol";
import "../node_modules/@klaytn/contracts/KIP/token/KIP17/extensions/KIP17Mintable.sol";

contract MockNft is KIP17("MNFT", "Mock NFT"), KIP17Mintable {

    constructor () {
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override (KIP17, KIP17Mintable) returns (bool) {
      return super.supportsInterface(interfaceId);
    }
}