<script>
  export let nftAddress;

  import { createNftContract } from "../model/nft";
  import axios from "axios";

  const contract = createNftContract(nftAddress);

  const myNft = {
    image: '1111',
    tokenId: '',
  };

  const anotherTraderNft = {
    image: '1111',
    tokenId: '',
  };

  const getNftMetadata = async (e) => {
    const tokenId = e.target.value;
    const tokenURI = await contract.tokenURI(tokenId);
    const response = await axios.get(`http://localhost:3000/?url=${tokenURI}`);
    const metadata = response.data;
    const image = metadata.image;
    myNft.image = image;
  }
  
</script>
<style>
  tr { display: block; float: left; }
  th, td { display: block; border: 1px solid black; }

  tr>*:not(:first-child) { border-top: 0; }
  tr:not(:first-child)>* { border-left:0; }
</style>
<table>
  <tr>
    <td><img src="{myNft.image}" alt="" ></td>
    <td><input on:input={getNftMetadata}></td>
  </tr>
  <tr>
    <th>IMAGE</th>
    <th>TOKEN ID</th>
  </tr>
  <tr>
    <td>{anotherTraderNft.image}</td>
    <td><input on:input={getNftMetadata}></td>
  </tr>
</table>