const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware

const { GetUserByMobile, CreateNewUser, TransferRequest, GetWalletByMobile, SendOTP, Login, Logout } = require('./src/user');
const { db, StartDb, SerializeDB } = require('./db/db');
const app = express();

app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json());

const port = process.env.PORT || 8080;

StartDb()
SerializeDB()

BigInt.prototype.toJSON = function () { return this.toString() }


app.get('/api/hello', (req, res) => {
  // db

  res.json({ message: 'Hello, World!' });
});

app.get('/mobile/:mobile_no', async (req, res) => {
  console.log("mobile number ===> ", req.params.mobile_no);

  const mobileNumber = req.params.mobile_no;
  if (!mobileNumber) {
    return res.json({ message: "not present" });
  }

  try {
    const user = await GetUserByMobile(mobileNumber);

    if (!user) {
      return res.status(400).json({ success: false, message: "not present" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get('/mobile', async (req, res) => {
  const receiverMobileNumber = req.query.receiver_mobile_number;

  if (!receiverMobileNumber) {
    res.status(400).json({ success: false, message: "receiver mobile number is required" })
    return
  }

  const response = await GetWalletByMobile(receiverMobileNumber);

  if (response.code == 400) {
    res.status(res.code).json({ success: false, message: "unable to fetch by receiver mobile number" })
    return
  }

  res.json({ success: true, data: response.data })

})

app.post('/register/', async (req, res) => {

  console.log("mobile number ===> ", req.query.mobile_no);
  console.log("encrypted json ===> ", req.query.pk_json);
  console.log("public key ===> ", req.query.public_key);
  console.log("otp ===> ", req.query.otp)
  // const otp = req.otp
  const mobileNumber = req.query.mobile_no;
  const pkJSON = req.query.pk_json;
  const publicKey = req.query.public_key;
  const otp = req.query.otp;
  const sessionId = req.query.session_id;

  try {
    const newUser = await CreateNewUser(mobileNumber, publicKey, pkJSON, otp, sessionId)
    if (newUser.code == 400) {
      return res.status(res.code).json({ success: false, message: res.message })
    }

    res.json({ success: true, message: "new user created" })
  }
  catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }

})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
