<script>
  export let uniqueMyMarket;
  export let reloadTrade;
  export let nftAddress;
  export let nftName;
  export let nftSymbol;

  import { createNftContract } from "../model/nft";
  import axios from "axios";
  import { ethers } from "ethers";
  import { NFT_TRADE_MARKET_ABI, NFT_TRADE_MARKET_ADDRESS, ERC721_ABI, PROXY_SERVER_URL } from "../config";

  const nftContract = createNftContract(nftAddress);
  const defaultNftImagePath = '/vite.svg';

  const my = {
    image: defaultNftImagePath,
    tokenId: -1,
    address: window.klaytn?.selectedAddress,
    approved: false,
  };

  const anotherTrader = {
    image: defaultNftImagePath,
    tokenId: -1,
    address: '',
  };

  const getNftMetadata = async (of, tokenId) => {
    let image = defaultNftImagePath;

    try {
      const tokenURI = await nftContract.tokenURI(tokenId);
      const response = await axios.get(`${PROXY_SERVER_URL}/proxy?url=${tokenURI}`);
      const metadata = response.data;
      image = metadata.image;
    } catch (e) {
      console.log(e);
    }

    if (of === 'my') {
      my.image = image;
      my.tokenId = parseInt(tokenId);
      my.approved = (await nftContract.getApproved(tokenId)) === NFT_TRADE_MARKET_ADDRESS;
    } else if (of === 'another') {
      anotherTrader.image = image
      anotherTrader.tokenId = parseInt(tokenId);
      const owner = await nftContract.ownerOf(tokenId);
      anotherTrader.address = owner;
    }
  }

  const sendTradeReceipt = async () => {
    const nftTradeMarket = new window.caver.klay.Contract(NFT_TRADE_MARKET_ABI, NFT_TRADE_MARKET_ADDRESS);

    await nftTradeMarket.methods.putTradeReceipt({
      anotherTrader: anotherTrader.address,
      givingTokenId: my.tokenId,
      nftAddress,
      receivingTokenId: anotherTrader.tokenId
    }).send({
      value: ethers.utils.parseEther('0.1'),
      from: window.klaytn.selectedAddress,
      gas: parseInt(297929 * 1.5)
    });

    reloadTrade();
    uniqueMyMarket = {};
  }

  const approve = async () => {
    const nft = new window.caver.klay.Contract(ERC721_ABI, nftAddress);

    await nft.methods.approve(NFT_TRADE_MARKET_ADDRESS, my.tokenId).send({
      from: window.klaytn.selectedAddress,
      gas: parseInt(49259 * 1.5)
    });

    my.approved = true;
  }
</script>
<style>
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
  th, td {
    padding: 5px;
    text-align: center;
  }
</style>
<div>
  <table>
    <tr>
      <td colspan=3>Address: {nftAddress}</td>
    </tr>
    <tr>
      <td colspan=3>{nftName}</td>
    </tr>
    <tr>
      <td colspan=3>{nftSymbol}</td>
    </tr>
    <tr>
      <td><b>ME</b></td>
      <th>OWNER</th>
      <td><b>COUNTERPARTY</b></td>
    </tr>
    <tr>
      <td><img src="{my.image}" alt="my nft" width="300" height="300"></td>
      <th>IMAGE</th>
      <td><img src="{anotherTrader.image}" alt="another trader nft" width="300" height="300" ></td>
    </tr>
    <tr>
      <td><input type="number" min="0" on:input={e => getNftMetadata('my', e.target.value)}></td>
      <th>TOKEN ID</th>
      <td><input type="number" min="0" on:input={e => getNftMetadata('another', e.target.value)}></td>
    </tr>
    <tr>
      <td>
        {#if my.tokenId >= 0}
          {#if my.approved}
            APPROVED
          {:else}
            <button on:click={approve}>APPROVE</button>
          {/if}
        {/if}
      </td>
      <th>APPROVED</th>
      <td><b>COUNTERPARTY</b></td>
    </tr>
  </table>
</div>

<div>
<button on:click={sendTradeReceipt}>Send Trade TX</button>
</div>