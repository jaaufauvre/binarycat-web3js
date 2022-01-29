# binarycat-web3js

[![](./res/binarycat.svg)](https://www.binarycat.app/)

Dumb 🤪 BinaryCat automation using Node and web3.js (https://web3js.readthedocs.io/)

## Prerequisites

Install the latest [Node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Strategy

- Account 1 and account 2 bet 0.02 or 0.03 AVAX randomly
- Account 1 always bets "up"
- Account 2 always bets "down"

## Known Limitations

(None)

## Usage

* Powershell:

```
npm install
$env:PK1="cb1086256baaa76cbb44a16ac9e0bc52d043c939f08b36c28791c29cc8f390d2"
$env:PK2="abb08d1436b1b53b374754444395257d8ac18cf279d3907b8093e77cc9f055b6"
npm start
```

* Ubuntu:
```
npm install
PK1="cb1086256baaa76cbb44a16ac9e0bc52d043c939f08b36c28791c29cc8f390d2" PK2="abb08d1436b1b53b374754444395257d8ac18cf279d3907b8093e77cc9f055b6" npm start
```

## Sample Output

```
2022-01-29T15:30:13.777Z - Starting...
2022-01-29T15:30:13.801Z - Round #1
2022-01-29T15:30:13.802Z - Sleep 65877ms
2022-01-29T15:31:19.694Z - Account 1...
2022-01-29T15:31:19.695Z - Creating transaction: ↑, 0.02 AVAX
2022-01-29T15:31:19.759Z - Sleep 64714ms
2022-01-29T15:31:20.131Z - [Callback] Sending transaction 0x43b3b223e30ccff171aa77f9bf217a9a7c47cb66423a638229735ebcdd345b25
2022-01-29T15:31:29.522Z - [Callback] Got receipt for 0x43b3b223e30ccff171aa77f9bf217a9a7c47cb66423a638229735ebcdd345b25
2022-01-29T15:32:24.482Z - Account 2...
2022-01-29T15:32:24.482Z - Creating transaction: ↓, 0.02 AVAX
2022-01-29T15:32:24.491Z - Sleep 169310ms
2022-01-29T15:32:24.973Z - [Callback] Sending transaction 0x45590edb7866b41e47c160e8821a43d500107695df444eb468efdf2df7ee9445
2022-01-29T15:32:39.388Z - [Callback] Got receipt for 0x45590edb7866b41e47c160e8821a43d500107695df444eb468efdf2df7ee9445
```
