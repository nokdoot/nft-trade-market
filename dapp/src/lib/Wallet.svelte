<script>
  let isUnlocked = false;

  klaytn._kaikas.isUnlocked().then((result) => { console.log(result); isUnlocked = result });

  const connectKaikas = async () => {
    await klaytn.enable();
    isUnlocked = await klaytn._kaikas.isUnlocked();
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
    Account: <p>{klaytn.selectedAddress}</p>
  </div>
{/if}
