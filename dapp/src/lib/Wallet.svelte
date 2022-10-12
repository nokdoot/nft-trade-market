<script>
  const connect = () => {
    console.log(typeof window.klaytn !== 'undefined');
    klaytn.enable();
    klaytn.on('accountsChanged', function(accounts) {
      console.log(accounts);
    })
  }
</script>

<button on:click="{connect}">
  connect
</button>