const { SUCCESS } = require("../constants");
const { GetUser, CreateUser, UpdateSessionId } = require("../db/db");

const SMS_API_KEY = process.env.SMS_API_KEY;

var axios = require('axios');
const { SendSignedRawTransaction } = require("./blockchain");

async function GetUserByMobile(mobileNo) {
  console.log('in GetUserByMobile')
  const user = await GetUser(mobileNo)
  console.log("done calling GetUser")

  console.log('user ', user)

  if (!user || !user.id) {
    return ""
  }

  return {
    id: user.id,
    phoneNo: user.phone_no,
    publicKey: user.public_key,
    pkJSON: user.pk_json
  }

}

// async function CreateNewUser(mobileNo, publicKey, encryptedJSON, otp, smsSessionId) {


//   var config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: `https://2factor.in/API/V1/${SMS_API_KEY}/SMS/VERIFY/${smsSessionId}/${otp}`,
//     headers: {}
//   };

//   const response = await axios(config)
//   console.log("response ", response)
//   console.log("response data ==> ",response.data)
//   if (response.status !== 200) {
//     return {
//       code: 400,
//       message: "invalid otp"
//     }
//   }

// console.log('creation of user ')
//   await CreateUser(mobileNo, publicKey, encryptedJSON)
//   console.log('creation of user done ')
//   return { message: "user registered", code: 200 }
// }

async function GetWalletByMobile(receiverMobileNumber) {

  const receiver = await GetUser(receiverMobileNumber)

  console.log("done calling GetWalletByMobile")

  console.log('receiver ', receiver)

  if (!receiver || !receiver.id) {
    return {
      code: 200,
      data: ""
    }
  }

  return {
    data: {
      id: receiver.id,
      phoneNo: receiver.phone_no,
      publicKey: receiver.public_key,
    },
    code: 200
  }

}

async function CreateNewUser(mobileNo, publicKey, encryptedJSON, otp, smsSessionId) {

  // if (otp !== DEFAULT_OTP) {
  //   return { message: "invalid OTP", code: 400 }
  // }

  var config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://2factor.in/API/V1/${SMS_API_KEY}/SMS/VERIFY/${smsSessionId}/${otp}`,
    headers: {}
  };

  // {"Status":"Success","Details":"OTP Matched"}
  const response = await axios(config)
  console.log("response ", response)
  if (response.data.Status !== SUCCESS) {
    return {
      code: 400,
      message: "invalid otp"
    }
  }

  console.log("mobilde no in create new user ", mobileNo);

  await CreateUser(mobileNo, publicKey, encryptedJSON)

  return { message: "user registered", code: 200 }
}

async function SendOTP(mobileNumber) {

  // const API_KEY = "21df2827-b473-11ef-8b17-0200cd936042"

  var config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://2factor.in/API/V1/${SMS_API_KEY}/SMS/${mobileNumber}/AUTOGEN/OTP1`,
    headers: {}
  };

  const response = await axios(config)

  console.log('response in send otp ', response.data)

  return {
    code: 200,
    data: response.data
  }

}

async function TransferRequest(receiverMobileNumber, amount, signedTx, loginSessionId) {

  // const rawTxHash = await walletClient.sendRawTransaction({ serializedTransaction: signedTx })

  // console.log("receipt raw tx hash ", await publicClient.getTransactionReceipt({ hash: rawTxHash }))

  // const receiptTx = await walletClient.waitForTransactionReceipt({ hash: rawTxHash })

  // TODO : add validations for receiverMogileNumber
  console.log('signed Tx ', signedTx)
  const receiptTx = await SendSignedRawTransaction(signedTx)

  console.log('receiptTx ', receiptTx)


  return {
    receipt: receiptTx,
    code: 200
  }

}

async function Login(mobileNo, otp, smsSessionId) {

  var config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://2factor.in/API/V1/${SMS_API_KEY}/SMS/VERIFY/${smsSessionId}/${otp}`,
    headers: {}
  };

  // {"Status":"Success","Details":"OTP Matched"}
  const response = await axios(config)
  console.log("response ", response)
  if (response.data.Status !== SUCCESS) {
    return {
      code: 400,
      message: "invalid otp"
    }
  }

  // temporary session id
  const sessionId = uuidv4()

  await UpdateSessionId(mobileNo, sessionId)

  return {
    code: 200,
    data: {
      sessionId: sessionId,
      mobileNo: mobileNo
    },
    message: "logged in"
  }

}

module.exports = {
  GetUserByMobile,
  CreateNewUser,
  SendOTP,
  GetWalletByMobile,
  Login,
  TransferRequest
}