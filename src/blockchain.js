// import { createPublicClient, createWalletClient, encodeFunctionData, http, parseEther } from 'viem'

const { privateKeyToAccount  }= require('viem/accounts')
const { odysseyTestnet } = require('viem/chains')

const { createWalletClient, http, createPublicClient } = require('viem')

const { eip7702Actions } = require('viem/experimental')

const DELEGATOR_PRIVATE_KEY = process.env.DELEGATOR_PRIVATE_KEY

const delegatorAccount = privateKeyToAccount(DELEGATOR_PRIVATE_KEY)

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

module.exports = {
  SendSignedRawTransaction
}




