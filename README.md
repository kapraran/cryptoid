# cryptoid

A complete blockchain-powered cryptocurrency system, created for educational purposes.

Features:
  * a complete implementation of the core ideas behind blockchain and cryptocurrencies
  * a node.js backend with express.js
  * a simple frontend that is powered by Vue
  * a pubsub implementation, using redis
  * test-driven development approach, using jest
  * ... and all of these are written in Typescript

## Screenshots

<a href="./.github/readme/transaction-pool.webp">
<img src="./.github/readme/transaction-pool.webp" width="30%"></a>

<a href="./.github/readme/block-list.webp">
<img src="./.github/readme/block-list.webp" width="30%"></a>

<a href="./.github/readme/block-details.webp">
<img src="./.github/readme/block-details.webp" width="30%"></a>


## Usage <a name = "usage"></a>

1. Start the main server

```
npm run server
```

2. Start a server for each peer with 
```
npm run server:peer
```

3. Navigate to the respective frontends in order to create transactions and mine new blocks
