<script>
  export let uniqueMyMarket;
  export let reloadTrade;
  import { ethers } from "ethers";
  import { createNftContract } from "../model/nft";
  import TradeReceipt from "./TradeReceipt.svelte";

  let uniqueTrade = {};

  const emptyNftInfo = {
    address: "",
    name: "",
    symbol: "",
    tokenId: "",
  }

  let nft = emptyNftInfo;

  const getNftInfo = async (e) => {
    try {
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
      }
    } catch (e) {
      console.log(e);
    }
    uniqueTrade = {};
  }
</script>

<div>
  NFT Address: <input on:input={getNftInfo} size=50>
</div>

{#key uniqueTrade}
  {#if nft.address}
    <TradeReceipt {uniqueMyMarket} {reloadTrade} nftAddress={nft.address} nftName={nft.name} nftSymbol={nft.symbol} />
  {/if}
{/key}