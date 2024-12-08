# Num Pay
Abstraction over public addresses using phone numbers for payments.

### Highlights :
1. Abstracts public addresses for payments and allows to use phone numbers.
2. Gas sponsoring using EIP-7702
3. Quick onboarding
4. Non-Custodial in nature

#### Pre-requisites : 
1. Node >= 18
2. Foundry
3. NPM >= 6

#### Smart contracts :
1. BatchCallDelegation : It allows to execute batch transaction
2. MockToken: It mocks behavior of an ERC20 token

`Note: Smart contracts are deployed on Odyssey testnet (https://www.ithaca.xyz/)` 

#### Steps to start : 
1. install all node dependecies using npm
2. add delegator private key which will act as sponsoring actor for user's transaction and sms provider api key into environment. Refer `example.env` to know variables to set.
3. start by running `npm run start`


#### User flow : 
1. User enters mobile number
2. If not present, onboarding will happen asking user to enter mobile number, otp received, private key to do payments and password to encrypt the private key. It resides on users machine
3. After onboarding, user can login again and do payments by asking user's mobile number registered on platform. 
