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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
