<script>
  import { ethers } from "ethers";
  import { createNftContract } from "../model/nft";
  import TradeReceipt from "./TradeReceipt.svelte";

  const emptyNftInfo = {
    address: "",
    name: "",
    symbol: "",
    tokenId: "",
  }

  let nft = emptyNftInfo;

  const getNftInfo = async (e) => {
    const address = e.target.value;
    if (!ethers.utils.isAddress(address)) {
      nft = emptyNftInfo;
      return;
    }
    const nftContract = createNftContract(address);
    const name = await nftContract.name();
    const symbol = await nftContract.symbol();

    nft = {
      address,
      name,
      symbol,
      tokenId: "",
    }
  }
</script>

<div>
  NFT Address: <input on:input={getNftInfo}>
  {nft.address}
  {nft.name}
  {nft.symbol}
  {nft.tokenId}
</div>

{#if nft.address}
  <TradeReceipt nftAddress={nft.address} />
{/if}