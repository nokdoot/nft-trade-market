// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./interface/INftTradeMarket.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

contract NftTradeMarket is INftTradeMarket, Pausable, AccessControl {
    struct TradeReceipt {
        address nftAddress;
        uint256 givingTokenId;
        uint256 receivingTokenId;
        address anotherTrader;
    }

    struct Trade {
        address nftAddress;
        address userAddressA;
        uint256 tokenIdA;
        address userAddressB;
        uint256 tokenIdB;
    }

    struct MyTrade {
        bytes32 tradeHash;
        address nftAddress;
        uint256 givingTokenId;
        uint256 receivingTokenId;
        address anotherTrader;
    }

    uint256 public fee;
    address payable public feeAccount;
    mapping(bytes32 => Trade) private market;
    mapping(bytes32 => uint256) private tradeFee;
    mapping(address => MyTrade[]) private marketOf;

    constructor(uint256 fee_, address payable feeAccount_) {
        fee = fee_;
        feeAccount = feeAccount_;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // fallback() payable external {}
    receive() payable external {
        feeAccount.transfer(msg.value);
        emit Receive(msg.sender, msg.value);
    }

    function _generateTrade(TradeReceipt memory tradeReceipt_) private view returns (Trade memory) {
        address nftAddress = tradeReceipt_.nftAddress;
        (address userAddressA, address userAddressB) = (msg.sender, tradeReceipt_.anotherTrader);
        (uint256 tokenIdA, uint256 tokenIdB) = (tradeReceipt_.givingTokenId, tradeReceipt_.receivingTokenId);
        if (msg.sender > tradeReceipt_.anotherTrader) {
            (userAddressA, userAddressB) = (tradeReceipt_.anotherTrader, msg.sender);
            (tokenIdA, tokenIdB) = (tradeReceipt_.receivingTokenId, tradeReceipt_.givingTokenId);
        }
        return Trade(nftAddress, userAddressA, tokenIdA, userAddressB, tokenIdB);
    }

    function _generateTradeHash(Trade memory trade_) private pure returns (bytes32) {
        return keccak256(abi.encode(trade_.nftAddress, trade_.userAddressA, trade_.tokenIdA, trade_.userAddressB, trade_.tokenIdB));
    }   

    function setFee(uint256 fee_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        fee = fee_;
    }

    function myMarket() public view returns (MyTrade[] memory) {
        return marketOf[msg.sender];
    }

    function putTradeReceipt(
        TradeReceipt calldata tradeReceipt_
    ) payable external whenNotPaused {
        require (
            msg.value == fee, 
            "not matched fee"
        );
        require (
            IERC721(tradeReceipt_.nftAddress).ownerOf(tradeReceipt_.givingTokenId) == msg.sender
            && IERC721(tradeReceipt_.nftAddress).ownerOf(tradeReceipt_.receivingTokenId) == tradeReceipt_.anotherTrader, 
            "not owner of token"
        );
        require (
            IERC721(tradeReceipt_.nftAddress).getApproved(tradeReceipt_.givingTokenId) == address(this),
            "not approved"
        );
        require (
            marketOf[msg.sender].length < 20,
            "put trade receipt up to 20"
        );

        Trade memory trade = _generateTrade(tradeReceipt_);
        bytes32 tradeHash = _generateTradeHash(trade);
        for (uint256 i = 0; i < marketOf[msg.sender].length; i++) {
            require (
                marketOf[msg.sender][i].tradeHash != tradeHash,
                'already put tradeReceipt'
            );
        }
        if (market[tradeHash].nftAddress == address(0x00)) {
            market[tradeHash] = trade;
            tradeFee[tradeHash] = msg.value;
            marketOf[msg.sender].push(MyTrade(
                tradeHash, 
                tradeReceipt_.nftAddress, 
                tradeReceipt_.givingTokenId, 
                tradeReceipt_.receivingTokenId, 
                tradeReceipt_.anotherTrader
            ));
            return;
        }

        // below is the trade logic
        address userAddressA = market[tradeHash].userAddressA;
        address userAddressB = market[tradeHash].userAddressB;
        IERC721(tradeReceipt_.nftAddress).transferFrom(userAddressA, userAddressB, market[tradeHash].tokenIdA);
        IERC721(tradeReceipt_.nftAddress).transferFrom(userAddressB, userAddressA, market[tradeHash].tokenIdB);
        feeAccount.transfer(tradeFee[tradeHash] + msg.value);

        delete market[tradeHash];
        delete tradeFee[tradeHash];
        for (uint256 i = 0; i < marketOf[tradeReceipt_.anotherTrader].length; i++) {
            if (marketOf[tradeReceipt_.anotherTrader][i].tradeHash == tradeHash) {
                marketOf[tradeReceipt_.anotherTrader][i] = marketOf[tradeReceipt_.anotherTrader][marketOf[tradeReceipt_.anotherTrader].length - 1];
                marketOf[tradeReceipt_.anotherTrader].pop();
                break;
            }
        }

        return;
    }

    function cancelTradeReceipt(bytes32 tradeHash_) external payable {
        for (uint256 i = 0; i < marketOf[msg.sender].length; i++) {
            if (marketOf[msg.sender][i].tradeHash == tradeHash_) {
                marketOf[msg.sender][i] = marketOf[msg.sender][marketOf[msg.sender].length - 1];
                marketOf[msg.sender].pop();
                break;
            }
            if (i == marketOf[msg.sender].length - 1) revert ('not trade owned');
        }

        uint256 _fee = tradeFee[tradeHash_];
        delete market[tradeHash_];
        delete tradeFee[tradeHash_];

        payable(msg.sender).transfer(_fee);

        return;
    }

    function cancelReceiptsAll() external payable {
        uint256 allFee = 0;
        while (marketOf[msg.sender].length > 0) {
            MyTrade memory myTrade = marketOf[msg.sender][marketOf[msg.sender].length - 1];
            allFee += tradeFee[myTrade.tradeHash];
            delete market[myTrade.tradeHash]; 
            delete tradeFee[myTrade.tradeHash];
            marketOf[msg.sender].pop();
        }

        payable(msg.sender).transfer(allFee);
        return;
    }
}
