<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLog from './assets/vite.svg'
  import Wallet from './lib/Wallet.svelte'
</script>

<main>
  <div>
    <p>
      내가 소유한 NFT와 상대방이 소유한 NFT를 교환하는 서비스입니다.
    </p>
    <p>
      양쪽의 트랜잭션이 실행되어야 교환이 발생합니다. [<b>SEND TRADE TX</b>]
    </p>
    <p>
      아직 교환되지 않은 건은 취소할 수 있습니다. [<b>CANCEL ALL</b>]
    </p>
  </div>
  <div class="card">
    <Wallet />
  </div>

  <div>
    <a href="https://vitejs.dev" target="_blank"> 
      <img src={viteLog} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank"> 
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
