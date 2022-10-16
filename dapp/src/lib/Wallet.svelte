<script>
  import Trade from './Trade.svelte'
  import MyMarket from './MyMarket.svelte'
  
  let isUnlocked = false;
  let chainId = 0;
  let selectedAddress = window.klaytn?.selectedAddress;

  let uniqueWallet = {};
  let uniqueMyMarket = {};

  function reloadTrade() {
    uniqueWallet = {}
  }

  window.klaytn?._kaikas.isUnlocked()
    .then((result) => { isUnlocked = result });

    
  window.klaytn?.on('networkChanged', () => {
    chainId = klaytn.networkVersion;
  });

  window.klaytn?.on('accountsChanged', (accounts) => {
    reloadTrade();
    console.log('accountsChanged')
    selectedAddress = window.klaytn?.selectedAddress
  })


  const connectKaikas = async () => {
    await window.klaytn.enable();
    isUnlocked = await window.klaytn._kaikas.isUnlocked();
    chainId = klaytn.networkVersion;
  }
</script>

<style>
  div > p {
    color: rgb(183, 0, 255)
  }
</style>
{#if !isUnlocked}
  <button on:click="{connectKaikas}">
    connectKaikas
  </button>
{:else}
  <div>
    Account: <p>{selectedAddress}</p>
  </div>
{/if}

{#key uniqueWallet}
  <Trade {uniqueMyMarket} {reloadTrade}/>
  <br>
  <br>
  <br>
  <br>
  <MyMarket {uniqueMyMarket} {reloadTrade}/>
{/key}

