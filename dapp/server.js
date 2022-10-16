const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.static('static'))

app.get('/proxy', async (req, res) => {
  try {
    const url = req.query.url;
    const response = await fetch(url);
    return response.body.pipe(res);
  } catch (e) {
    console.log(e);
  }
  return res.body.pipe(response.body);
});

app.listen(3000, () => { console.log('http-proxy: 3000') });