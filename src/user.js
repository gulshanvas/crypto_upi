const { GetUser, CreateUser } = require("../db/db");

const SMS_API_KEY = process.env.SMS_API_KEY;

var axios = require('axios').default;

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

async function CreateNewUser(mobileNo, publicKey, encryptedJSON, otp, smsSessionId) {

  var config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://2factor.in/API/V1/${SMS_API_KEY}/SMS/VERIFY/${smsSessionId}/${otp}`,
    headers: {}
  };

  const response = await axios(config)
  console.log("response ", response)
  if (response.Status !== SUCCESS) {
    return {
      code: 400,
      message: "invalid otp"
    }
  }


  await CreateUser(mobileNo, publicKey, encryptedJSON)

  return { message: "user registered", code: 200 }
}

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
  if (response.Status !== SUCCESS) {
    return {
      code: 400,
      message: "invalid otp"
    }
  }


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

module.exports = {
  GetUserByMobile,
  CreateNewUser,
  SendOTP,
  GetWalletByMobile
}