// import { createPublicClient, createWalletClient, encodeFunctionData, http, parseEther } from 'viem'

const { privateKeyToAccount  }= require('viem/accounts')
const { odysseyTestnet } = require('viem/chains')

const { ethers } = require('ethers');

const { createWalletClient, http, createPublicClient, parseAbi } = require('viem')

const { eip7702Actions } = require('viem/experimental')

const DELEGATOR_PRIVATE_KEY = process.env.DELEGATOR_PRIVATE_KEY

const delegatorAccount = privateKeyToAccount(DELEGATOR_PRIVATE_KEY)

// const tokenABI = [
//   {
//     "constant": true,
//     "inputs": [{ "name": "_owner", "type": "address" }],
//     "name": "balanceOf",
//     "outputs": [{ "name": "balance", "type": "uint256" }],
//     "type": "function"
//   }
// ];

const walletClient = createWalletClient({
  account: delegatorAccount,
  chain: odysseyTestnet,
  transport: http("https://odyssey.ithaca.xyz")
}).extend(eip7702Actions())

const publicClient = createPublicClient({
  account: delegatorAccount,
  chain: odysseyTestnet,
  transport: http("https://odyssey.ithaca.xyz")
}).extend(eip7702Actions())

async function SendSignedRawTransaction(authorizationList, encodedData, toAddress) {

  const transactionPreparedDelegate = await walletClient.prepareTransactionRequest({
    account: delegatorAccount,
    authorizationList: [authorizationList],
    // account: walletClient.
    data: encodedData,
    to: toAddress,
  })

  const signedTx = await walletClient.signTransaction(transactionPreparedDelegate)

  const rawTxHash = await walletClient.sendRawTransaction({ serializedTransaction: signedTx })

  const receiptTx = await publicClient.waitForTransactionReceipt({ hash: rawTxHash })

  console.log('receiptTx ', receiptTx)

  return receiptTx;
}

// async function FetchERC20Balance(userAddress) {

//   const data = await publicClient.readContract({
//     abi: parseAbi(['function name() view returns (string)']),
//     code: '0xb9A3C6197b864B8d49Ef86894249B952Cbae1e34',
//     functionName: 'name'
//   })

//   console.log('data ',data);


//   const balanceOfUser = await publicClient.readContract({
//     address: "0xb9A3C6197b864B8d49Ef86894249B952Cbae1e34",
//     tokenABI,
//     functionName: 'balanceOf',
//     args: [userAddress]
//   });

//   return balanceOfUser

// }



const provider = new ethers.JsonRpcProvider('https://odyssey.ithaca.xyz');
const contractAddress = "0xb9A3C6197b864B8d49Ef86894249B952Cbae1e34";
// const userAddress = "0xYourUserAddress";
const tokenABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  }
];

const contract = new ethers.Contract(contractAddress, tokenABI, provider);

async function FetchERC20Balance(userAddress) {
  const balance = await contract.balanceOf(userAddress);
  console.log(`Balance: ${balance.toString()}`);
  return balance;
}

module.exports = {
  SendSignedRawTransaction,
  FetchERC20Balance
}




