import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Provider } from "@ethersproject/providers";
import { expect } from "chai";
import { BigNumberish } from "ethers";
import { MockNft, NftTradeMarket } from "../typechain-types";
import { ethers } from "hardhat";

const deployNftTradeMarket = async (fee: BigNumberish, feeAccount: string) => {
  const NftTradeMarket = await ethers.getContractFactory("NftTradeMarket");
  const nftTradeMarket = await NftTradeMarket.deploy(
    fee,
    feeAccount
  );
  await nftTradeMarket.deployed();

  return nftTradeMarket as NftTradeMarket;
}

const deployMockNft = async () => {
  const MockNft = await ethers.getContractFactory("MockNft");
  const mockNft = await MockNft.deploy();
  await mockNft.deployed();
  return mockNft;
}

describe("nftTradeMarket", () => {

  let owner: SignerWithAddress;
  let addrA: SignerWithAddress;
  let addrB: SignerWithAddress;
  let addrC: SignerWithAddress;
  let feeAccount: SignerWithAddress;
  let provider: Provider;
  let nftTradeMarket: NftTradeMarket;
  let gasPrice: BigNumberish;
  let mockNft: MockNft;
  let mockNft2: MockNft;
  let fee: BigNumberish;
  let tradeReceiptLimit = 20;

  beforeEach("", async () => {
    [owner, addrA, addrB, addrC] = await ethers.getSigners();
    feeAccount = (await ethers.getSigners()).at(-1)!;
    provider = owner.provider!;
    fee = ethers.utils.parseEther("10");
    nftTradeMarket = await deployNftTradeMarket(fee, feeAccount.address);
    mockNft = await deployMockNft();
    mockNft2 = await deployMockNft();
    gasPrice = await provider.getGasPrice();

    await mockNft.mintWithCount(addrA.address, 100);
    await mockNft.mintWithCount(addrB.address, 100);
    await mockNft.mintWithCount(addrC.address, 100);

  });

  describe("Validates", async () => {
    it("Contract must have receive function", async () => {
      const value = ethers.utils.parseEther("10");
      await owner.sendTransaction({
        value,
        to: nftTradeMarket.address,
      });
    });
  
    it("Contract must throw value to fee account", async () => {
      const value = ethers.utils.parseEther("10");
      const balanceBefore = await feeAccount.getBalance();
      await owner.sendTransaction({
        value,
        to: nftTradeMarket.address,
      });
      const balanceAfter = await feeAccount.getBalance();
      expect(balanceAfter).to.be.eq(balanceBefore.add(value));
    });
  
    it("Validate fee", async () => {
      await expect(
        nftTradeMarket.connect(addrA).putTradeReceipt(
          { nftAddress: mockNft.address, givingTokenId: 0, receivingTokenId: 100, anotherTrader: addrB.address },
          {
            value: 0
          }
        )
      ).to.be.revertedWith("not matched fee");
    });
  
    it("Validate ownerOf", async () => {
      await expect(nftTradeMarket.connect(addrA).putTradeReceipt(
        { nftAddress: mockNft.address, givingTokenId: 100, receivingTokenId: 0, anotherTrader: addrB.address },
        {
          value: fee
        }
      )).to.be.revertedWith("not owner of token");
    });
  
    it("Validate approved", async () => {
      await expect(nftTradeMarket.connect(addrA).putTradeReceipt(
        { nftAddress: mockNft.address, givingTokenId: 0, receivingTokenId: 100, anotherTrader: addrB.address },
        { value: fee }
      )).to.be.revertedWith("not approved");
    });
  
    it("Validate trader receipt limit", async () => {
      for (let i = 0; i < tradeReceiptLimit; i++) {
        await mockNft.connect(addrA).approve(nftTradeMarket.address, i);
        await nftTradeMarket.connect(addrA).putTradeReceipt(
          { nftAddress: mockNft.address, givingTokenId: i, receivingTokenId: 100, anotherTrader: addrB.address },
          { value: fee }
        );
      }
      await mockNft.connect(addrA).approve(nftTradeMarket.address, tradeReceiptLimit);
      await expect(nftTradeMarket.connect(addrA).putTradeReceipt(
        { nftAddress: mockNft.address, givingTokenId: tradeReceiptLimit, receivingTokenId: 100, anotherTrader: addrB.address },
        { value: fee }
      )).to.be.revertedWith("put trade receipt up to 20");
    });
  
    it("Prevent duplicate trade", async () => {
      await mockNft.connect(addrA).approve(nftTradeMarket.address, 0);
      await nftTradeMarket.connect(addrA).putTradeReceipt(
        { nftAddress: mockNft.address, givingTokenId: 0, receivingTokenId: 100, anotherTrader: addrB.address },
        { value: fee }
      );
  
      await expect(nftTradeMarket.connect(addrA).putTradeReceipt(
        { nftAddress: mockNft.address, givingTokenId: 0, receivingTokenId: 100, anotherTrader: addrB.address },
        { value: fee }
      )).to.be.revertedWith("already put tradeReceipt");
    });

    it("Prevent set fee by not admin", async () => {
      await expect(nftTradeMarket.connect(addrA).setFee(ethers.utils.parseEther('20'))).to.be.revertedWith(
        "AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x0000000000000000000000000000000000000000000000000000000000000000");
    });
  });

  describe("successes", async () => {
    it("set fee", async () => {
      await nftTradeMarket.connect(owner).setFee(ethers.utils.parseEther('20'));
      expect(await nftTradeMarket.fee()).to.be.eq(ethers.utils.parseEther('20'));
    });

    it.only("tttttttt", async () => {
      await mockNft.connect(addrA).approve(nftTradeMarket.address, 0);
      await nftTradeMarket.connect(addrA).putTradeReceipt({
        anotherTrader: addrB.address,
        givingTokenId: 0,
        nftAddress: mockNft.address,
        receivingTokenId: 100
      }, {
        value: fee
      });

      await mockNft.connect(addrA).approve(nftTradeMarket.address, 1);
      await nftTradeMarket.connect(addrA).putTradeReceipt({
        anotherTrader: addrB.address,
        givingTokenId: 1,
        nftAddress: mockNft.address,
        receivingTokenId: 100
      }, {
        value: fee
      });
    });

    it("put trade receipts and list them", async () => {
      const receipts = [];
      for (let i = 0; i < tradeReceiptLimit; i++) {
        await mockNft.connect(addrA).approve(nftTradeMarket.address, i);
        const receipt = { nftAddress: mockNft.address, givingTokenId: i, receivingTokenId: 100, anotherTrader: addrB.address }
        await nftTradeMarket.connect(addrA).putTradeReceipt(
          receipt,
          { value: fee }
        );
        receipts.push({
          nftAddress: receipt.nftAddress,
          givingTokenId: ethers.BigNumber.from(receipt.givingTokenId).toString(),
          receivingTokenId: ethers.BigNumber.from(receipt.receivingTokenId).toString(),
          anotherTrader: addrB.address
        });
      }

      const addedReceipts = (await nftTradeMarket.connect(addrA).myMarket()).map((result) => {
        return {
          nftAddress: result.nftAddress,
          givingTokenId: result.givingTokenId.toString(),
          receivingTokenId: result.receivingTokenId.toString(),
          anotherTrader: result.anotherTrader
        }
      });

      const compareReceipt = (a: any, b: any) => {
        const compare = a.nftAddress === b.nftAddress
          && a.givingTokenId === b.givingTokenId
          && a.receivingTokenId === b.receivingTokenId
          && a.anotherTrader === b.anotherTrader

        return compare;
      }
      for (let i = 0; i < receipts.length; i++) {
        expect(compareReceipt(receipts[i], addedReceipts[i])).to.be.eq(true);
      }
    });

    it("trade", async () => {
      for (let i = 0; i < tradeReceiptLimit; i++) {
        await mockNft.connect(addrA).approve(nftTradeMarket.address, i);
        const receipt = { nftAddress: mockNft.address, givingTokenId: i, receivingTokenId: 100, anotherTrader: addrB.address }
        await nftTradeMarket.connect(addrA).putTradeReceipt(
          receipt,
          { value: fee }
        );
      }

      await mockNft.connect(addrB).approve(nftTradeMarket.address, 100);
      await nftTradeMarket.connect(addrB).putTradeReceipt(
        { nftAddress: mockNft.address, givingTokenId: 100, receivingTokenId: 0, anotherTrader: addrA.address },
        { value: fee }
      );

      expect(await mockNft.ownerOf(0)).to.be.eq(addrB.address);
      expect(await mockNft.ownerOf(100)).to.be.eq(addrA.address);

      expect((await nftTradeMarket.connect(addrA).myMarket()).length).to.be.eq(tradeReceiptLimit - 1);
      expect((await nftTradeMarket.connect(addrA).myMarket()).length).to.be.eq(tradeReceiptLimit - 1);
    });

    it("cancel all receipts", async () => {
      for (let i = 0; i < tradeReceiptLimit; i++) {
        await mockNft.connect(addrA).approve(nftTradeMarket.address, i);
        const receipt = { nftAddress: mockNft.address, givingTokenId: i, receivingTokenId: 100, anotherTrader: addrB.address }
        await nftTradeMarket.connect(addrA).putTradeReceipt(
          receipt,
          { value: fee }
        );
      }

      await nftTradeMarket.connect(addrA).cancelReceiptsAll();

      await mockNft.connect(addrB).approve(nftTradeMarket.address, 100);
      await nftTradeMarket.connect(addrB).putTradeReceipt(
        { nftAddress: mockNft.address, givingTokenId: 100, receivingTokenId: 0, anotherTrader: addrA.address },
        { value: fee }
      );

      expect(await mockNft.ownerOf(0)).to.be.eq(addrA.address);
      expect(await mockNft.ownerOf(100)).to.be.eq(addrB.address);
      expect(await mockNft.ownerOf(200)).to.be.eq(addrC.address);
    });

    it("cancel a receipt", async () => {
      for (let i = 0; i < tradeReceiptLimit; i++) {
        await mockNft.connect(addrA).approve(nftTradeMarket.address, i);
        const receipt = { nftAddress: mockNft.address, givingTokenId: i, receivingTokenId: 100, anotherTrader: addrB.address }
        await nftTradeMarket.connect(addrA).putTradeReceipt(
          receipt,
          { value: fee }
        );
      }

      const myMarket = await nftTradeMarket.connect(addrA).myMarket();
      const targetTrade = myMarket[5];

      await nftTradeMarket.connect(addrA).cancelTradeReceipt(targetTrade.tradeHash);

      const myMarket2 = await nftTradeMarket.connect(addrA).myMarket();
      const deletedTrade = myMarket2.find((trade) => {
        return trade.tradeHash === targetTrade.tradeHash
      });

      expect(myMarket2.length).to.be.eq(tradeReceiptLimit - 1);
      expect(deletedTrade).to.be.eq(undefined);
    });

    it("try trade with irrelevant token Id", async () => {
      for (let i = 0; i < tradeReceiptLimit; i++) {
        await mockNft.connect(addrA).approve(nftTradeMarket.address, i);
        const receipt = { nftAddress: mockNft.address, givingTokenId: i, receivingTokenId: 100, anotherTrader: addrB.address }
        await nftTradeMarket.connect(addrA).putTradeReceipt(
          receipt,
          { value: fee }
        );
      }

      await mockNft.connect(addrB).approve(nftTradeMarket.address, 101);
      await nftTradeMarket.connect(addrB).putTradeReceipt(
        { nftAddress: mockNft.address, givingTokenId: 101, receivingTokenId: 0, anotherTrader: addrA.address },
        { value: fee }
      );

      expect(await mockNft.ownerOf(0)).to.be.eq(addrA.address);
      expect(await mockNft.ownerOf(100)).to.be.eq(addrB.address);
    });
  }); 
});
