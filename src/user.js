const { GetUser, CreateUser } = require("../db/db");

const SMS_API_KEY = process.env.SMS_API_KEY;


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


module.exports = {
  GetUserByMobile,
  CreateNewUser
}