const { GetUser } = require("../db/db");


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