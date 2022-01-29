import Web3 from "web3";
import fs from "fs";

const DEBUG = false;

// Accounts
const PK1 = process.env.PK1;
const PK2 = process.env.PK2;

// Avalanche
const CCHAIN_RPC = "https://api.avax.network/ext/bc/C/rpc";

// BinaryCat
const BC_CONTRACT = "0xd582aeaa7202a8d68a6c31db92e53c16019e1740";
const BC_GAS_LIMIT = 300000;
const BC_CONTRACT_ABI = JSON.parse(
  fs.readFileSync("./res/binarycat.abi", "utf8")
);
const BET_UP = 1;
const BET_DOWN = 0;

const main = async () => {
  log("Starting...");
  var roundNumber = 0;

  //
  // Create Web3 instance
  //
  const rpcWeb3 = new Web3(new Web3.providers.HttpProvider(CCHAIN_RPC));

  //
  // Create accounts
  //
  const account1 = rpcWeb3.eth.accounts.privateKeyToAccount(PK1);
  const account2 = rpcWeb3.eth.accounts.privateKeyToAccount(PK2);
  debug("Account 1:\n" + prettify(account1));
  debug("Account 2:\n" + prettify(account2));

  //
  // Create the BinaryCat contract
  //
  const contract = new rpcWeb3.eth.Contract(BC_CONTRACT_ABI, BC_CONTRACT);

  //
  // Bet
  //
  while (true) {
    const startTime = new Date();
    roundNumber++;
    log("Round #" + roundNumber, YELLOW);

    await sleep(randomInt(60000, 90000));

    // Address 1
    log("Account 1...", YELLOW);
    bet(rpcWeb3, contract, account1, BET_UP, randomAvaxAmount());

    await sleep(randomInt(60000, 90000));

    // Address 2
    log("Account 2...", YELLOW);
    bet(rpcWeb3, contract, account2, BET_DOWN, randomAvaxAmount());

    // Wait for 5 minutes in total
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    await sleep(300000 - durationMs);
  }
};

//
// Create and send a BinaryCat bet transaction
//
function bet(rpcWeb3, contract, account, betSide, betAmount) {
  log(
    "Creating transaction: " +
      (betSide == BET_UP ? "↑" : "↓") +
      ", " +
      betAmount +
      " AVAX",
    YELLOW
  );
  const betTx = {
    from: account.address,
    to: BC_CONTRACT,
    // The AVAX bet amount
    value: rpcWeb3.utils.toWei(betAmount),
    // The amount of gas to use for the transaction (unused gas is refunded)
    gas: BC_GAS_LIMIT,
    // The price of gas for this transaction in wei, defaults to web3.eth.gasPrice
    // (gasPrice)
    // The maximum fee per gas that the transaction is willing to pay in total
    // (maxFeePerGas)
    // The maximum fee per gas to give miners to incentivize them to include the transaction
    maxPriorityFeePerGas: rpcWeb3.utils.toWei("0.0000000025"),
    data: contract.methods.placeBet(betSide).encodeABI(), // ABI byte string
  };
  account.signTransaction(betTx, (err, res) => {
    if (err || !res) {
      log("[Callback] Error when signing transaction: " + err, RED);
      exit();
    }
    log("[Callback] Sending transaction " + res.transactionHash, GREEN);
    debug("Transaction data:\n" + JSON.stringify(res));
    const sentTx = rpcWeb3.eth.sendSignedTransaction(
      res.raw || res.rawTransaction
    );
    sentTx.on("receipt", (receipt) => {
      log("[Callback] Got receipt for " + receipt.transactionHash, GREEN);
      debug("Receipt:\n" + JSON.stringify(receipt));
    });
    sentTx.on("error", (err) => {
      log("[Callback] Error when sending transaction: " + err, RED);
      exit();
    });
  });
}

function sleep(ms) {
  log("Sleep " + ms + "ms");
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomAvaxAmount() {
  return "0.0" + randomInt(2, 3);
}

const RED = "\x1b[31m%s\x1b[0m";
const GREEN = "\x1b[32m%s\x1b[0m";
const YELLOW = "\x1b[33m%s\x1b[0m";

function log(msg, color) {
  const logMsg = new Date().toISOString() + " - " + msg;
  if (color) {
    console.log(color, logMsg);
  } else {
    console.log(logMsg);
  }
}

function debug(msg) {
  if (DEBUG) {
    log("[Debug] " + msg);
  }
}

function prettify(obj) {
  let clone = Object.assign({}, obj);
  if (clone.privateKey) {
    clone.privateKey = "*********";
  }
  return JSON.stringify(clone, null, 2);
}

function exit() {
  process.exit(1);
}

main();
