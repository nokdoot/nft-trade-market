<script>
  export let uniqueMyMarket;
  export let reloadTrade;
  import { NFT_TRADE_MARKET_ABI, NFT_TRADE_MARKET_ADDRESS } from '../config';

  let selectedAddress = window.klaytn?.selectedAddress;

  
  let myMarket = [];

  const getMyMarket = async () => {
    const nftTradeMarket = new window.caver.klay.Contract(NFT_TRADE_MARKET_ABI, NFT_TRADE_MARKET_ADDRESS);

    myMarket = await nftTradeMarket.methods.myMarket().call();
  };

  getMyMarket();

  const cancelAll = async () => {
    const nftTradeMarket = new window.caver.klay.Contract(NFT_TRADE_MARKET_ABI, NFT_TRADE_MARKET_ADDRESS);
    await nftTradeMarket.methods.cancelReceiptsAll().send({
      from: selectedAddress,
      gas: parseInt(942822 * 1.5 * myMarket.length)
    });
    uniqueMyMarket = {};
    reloadTrade();
  }

</script>

<style>
  div > p {
    color: rgb(183, 0, 255)
  }
</style>
{#key uniqueMyMarket}
<div>
  {#if myMarket.length > 0 }
  <table>
    <tr>
      <th>NFT ADDRESS</th>
      <th>My TOKEN ID</th>
      <th>COUNTERPARTY ADDRESS</th>
      <th>COUNTERPARTY TOKEN ID</th>
    </tr>
    {#each myMarket as market}
    <tr>
      <td>
        {market.nftAddress}
      </td>
      <td>
        {market.givingTokenId}
      </td>
      <td>
        {market.anotherTrader}
      </td>
      <td>
        {market.receivingTokenId}
      </td>
    </tr>
    {/each}
  </table>
  <button on:click={cancelAll}>CANCEL ALL</button>
  {/if}
</div>
{/key}
