// registrationController.js

const utils = require('./utils');


const { Web3 } = require('web3');
const ganache = require('ganache-cli');
const nodemailer = require('nodemailer');
const sha256 = require('sha256')
const contractData = require('../build/contracts/Election.json');

// Initialize web3 and contract instance
const web3 = new Web3('http://127.0.0.1:8545'); // Assuming Ganache cli is running on the default port
const contractABI = contractData.abi;

// Replace double check of network address
const contractAddress = contractData.networks['1710258336597'].address; // Adjust network ID accordingly
const contract = new web3.eth.Contract(contractABI, contractAddress);
// acc -- public key key updated 
const acc = "0x4ddDcb255d75B9f7817bcC7e01E280DEA0001213";
const PrivateKey = "0x1c4708790e6902703775567ddd51826459d627b93a9de6a4a89b96a265b6b0a6";

const mysql = require('mysql2/promise'); // Import mysql2 module


// MySQL database configuration
const dbConfig = {
    host: 'localhost', // Remove the port number from here
    port: 3306, // Port should be specified separately
    user: 'root',
    password: '1234',
    database: 'Voting'
};


exports.Register = async (req, res) => {
    const { name, uniqueId, emailOrPhone, otp } = req.body;

    try {
        // Check if OTP provided matches the OTP stored in the hashmap
        const otpStored = utils.getOTP(name + uniqueId);
        if (!otpStored || otp !== otpStored) {
            console.log('Invalid OTP:', otp, otpStored);
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Check if the uniqueId already exists in the database
        const connection = await mysql.createConnection(dbConfig);
        const [rows, fields] = await connection.execute('SELECT * FROM users WHERE uniqueId = ?', [uniqueId]);

        if (rows.length > 0) {
            console.log("User with unique ID already exists");
            return res.status(400).json({ error: 'UniqueId already exists' });
        }

        // Generate new pair of public and private keys
        const newUserKeys = web3.eth.accounts.create();
        const publicKey = newUserKeys.address;
        const privateKey = newUserKeys.privateKey;
        console.log("New pair:");
        console.log(newUserKeys);

        // Add the new account to the wallet
        const account = web3.eth.accounts.wallet.add(privateKey);

        // Fund the newly created account with half an ether
        const amountToSend = web3.utils.toWei('0.5', 'ether'); // Convert 0.5 ether to Wei
        const senderAddress = acc; // Address from which to send ether
        const gasPrice = await web3.eth.getGasPrice();
        
        // Estimate gas cost for the transaction
        const gasCost = await web3.eth.estimateGas({
            to: publicKey,
            value: amountToSend,
        });

        // Calculate total transaction value
        const totalValue = BigInt(amountToSend) + BigInt(gasCost) * BigInt(gasPrice);

        // Check sender account balance
        const senderBalance = await web3.eth.getBalance(senderAddress);
        if (BigInt(senderBalance) < totalValue) {
            throw new Error("Insufficient balance in sender account");
        }

        // Sign and send the transaction
        const tx = await web3.eth.accounts.signTransaction({
            to: publicKey,
            from: senderAddress,
            value: amountToSend,
            gas: gasCost, // Use gas cost for gas limit
            gasPrice: gasPrice
        }, PrivateKey);

        const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);

        // Call the smart contract method to register for voting
        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
        const registerTx = await contractInstance.methods.registerForVoting().send({ from: publicKey });
        console.log("Register for voting transaction:", registerTx);

        // Split private key and store in database
        const [part1, part2] = utils.splitPrivateKey(privateKey);
        const hPart1 = sha256(part1);

        // Store user details and keys in MySQL database
        await connection.execute(
            'INSERT INTO users (name, uniqueId, emailOrPhone, publicKey, privateKey) VALUES (?, ?, ?, ?, ?)',
            [name, uniqueId, emailOrPhone, hPart1 , part2]
        );

        // Close MySQL connection
        await connection.end();

        // Create nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'patchalajohn@gmail.com', // Your Gmail email address
                pass: 'wnlg xswu xrtn oycj' // Your Gmail password
            }
        });

        // Compose email/text message
        const mailOptions = {
            from: 'patchalajohn@gmail.com',
            to: emailOrPhone,
            subject: 'PRIVATE KEY',
            text: `Your PRIVATE KEY for Voting : ${part1}`
        };

        // Send email/text message
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                throw new Error('Failed to send email');
            } else {
                console.log('Email sent:', info.response);
                res.json({ message: 'Registration successful' });
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};



// exports.Register = async (req, res) => {
//     const { name, uniqueId, emailOrPhone, otp } = req.body;

//     try {
//         // Check if OTP provided matches the OTP stored in the hashmap
//         const otpStored = utils.getOTP(name + uniqueId);
//         if (!otpStored || otp !== otpStored) {
//             console.log('Invalid OTP:', otp, otpStored);
//             return res.status(400).json({ error: 'Invalid OTP' });
//         }

//         // Check if the uniqueId already exists in the database
//         const connection = await mysql.createConnection(dbConfig);
//         const [rows, fields] = await connection.execute('SELECT * FROM users WHERE uniqueId = ?', [uniqueId]);

//         if (rows.length > 0) {
//             console.log("User with unique ID already exists");
//             return res.status(400).json({ error: 'UniqueId already exists' });
//         }

//         // Generate new pair of public and private keys
//         const newUserKeys = web3.eth.accounts.create();
//         const publicKey = newUserKeys.address;
//         const privateKey = newUserKeys.privateKey;
//         console.log("New pair:");
//         console.log(newUserKeys);

//         // Add the new account to the wallet
//         const account = web3.eth.accounts.wallet.add(privateKey);

//         // Fund the newly created account with half an ether
//         const amountToSend = web3.utils.toWei('0.5', 'ether'); // Convert 0.5 ether to Wei
//         const senderAddress = acc; // Address from which to send ether
//         const gasPrice = await web3.eth.getGasPrice();
        
//         // Estimate gas cost for the transaction
//         const gasCost = await web3.eth.estimateGas({
//             to: publicKey,
//             value: amountToSend,
//         });

//         // Calculate total transaction value
//         const totalValue = BigInt(amountToSend) + BigInt(gasCost) * BigInt(gasPrice);

//         // Check sender account balance
//         const senderBalance = await web3.eth.getBalance(senderAddress);
//         if (BigInt(senderBalance) < totalValue) {
//             throw new Error("Insufficient balance in sender account");
//         }

//         // Sign and send the transaction
//         const tx = await web3.eth.accounts.signTransaction({
//             to: publicKey,
//             from: senderAddress,
//             value: amountToSend,
//             gas: gasCost, // Use gas cost for gas limit
//             gasPrice: gasPrice
//         }, PrivateKey);

//         const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);

//         // Call the smart contract method to register for voting
//         const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
//         const registerTx = await contractInstance.methods.registerForVoting().send({ from: publicKey });
//         console.log("Register for voting transaction:", registerTx);

//         // Split private key and store in database
//         const [part1, part2] = utils.splitPrivateKey(privateKey);
//         const hPart1 = sha256(part1);

//         // Store user details and keys in MySQL database
//         await connection.execute(
//             'INSERT INTO users (name, uniqueId, emailOrPhone, publicKey, privateKey) VALUES (?, ?, ?, ?, ?)',
//             [name, uniqueId, emailOrPhone, hPart1 , part2]
//         );

//         // Close MySQL connection
//         await connection.end();

//         // Create nodemailer transporter
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'patchalajohn@gmail.com', // Your Gmail email address
//                 pass: 'wnlg xswu xrtn oycj' // Your Gmail password
//             }
//         });

//         // Compose email/text message
//         const mailOptions = {
//             from: 'patchalajohn@gmail.com',
//             to: emailOrPhone,
//             subject: 'PRIVATE KEY',
//             text: `Your PRIVATE KEY for Voting : ${part1}`
//         };

//         // Send email/text message
//         await transporter.sendMail(mailOptions);

//         res.json({ message: 'Registration successful' });

//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ error: 'Failed to register user' });
//     }
// };





// exports.Register = async (req, res) => {
//     const { name, uniqueId, emailOrPhone, otp } = req.body;

//     try {
//         // Check if OTP provided matches the OTP stored in the hashmap
//         const otpStored = utils.getOTP(name + uniqueId);
//         if (!otpStored || otp !== otpStored) {
//             console.log('invalid otp '+ otp +"  "+ otpStored)
//             return res.status(400).json({ error: 'Invalid OTP' });
//         }

//         // Check if the uniqueId already exists in the database
//         const connection = await mysql.createConnection(dbConfig);
//         const [rows, fields] = await connection.execute('SELECT * FROM users WHERE uniqueId = ?', [uniqueId]);

//         if (rows.length > 0) {
//             console.log("already exists user with unniqiue ID")
//             return res.json({ error: 'UniqueId already exists' });
//             // return res.status(400).json({ error: 'UniqueId already exists' });
//         }

//         // Generate new pair of public and private keys
//         const newUserKeys = web3.eth.accounts.create();
//         const publicKey = newUserKeys.address;
//         const privateKey = newUserKeys.privateKey;
//         console.log("new pair")
//         console.log(newUserKeys)
//         // console.log(sha256(privateKey))//0xf62858eeb30c7bd2fe6762e8b23a974425b6e40a8a40aebd326167362c85365d
//         // console.log((privateKey))//0xf62858eeb30c7bd2fe6762e8b23a974425b6e40a8a40aebd326167362c85365d

//          // Fund the newly created account with half an ether
//          const amountToSend = web3.utils.toWei('0.5', 'ether'); // Convert 0.5 ether to Wei
//          const senderAddress = acc; // Address from which to send ether
//          await web3.eth.sendTransaction({
//              from: senderAddress,
//              to: publicKey,
//              value: amountToSend,
//          });
//          const [part1,part2] = utils.splitPrivateKey(privateKey);
//          const hPart1 = sha256(part1);
//         //  console.log(part1)
//         //  console.log(sha256(part1))
//         // Store user details and keys in MySQL database
//         await connection.execute(
//             'INSERT INTO users (name, uniqueId, emailOrPhone, publicKey, privateKey) VALUES (?, ?, ?, ?, ?)',
//             [name, uniqueId, emailOrPhone, hPart1 , part2]
//         );

//         // Close MySQL connection
//         await connection.end();

//         // Create nodemailer transporter
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'patchalajohn@gmail.com', // Your Gmail email address
//                 pass: 'wnlg xswu xrtn oycj' // Your Gmail password
//             }
//         });

//         // Compose email/text message
//         const mailOptions = {
//             from: 'patchalajohn@gmail.com',
//             to: emailOrPhone,
//             subject: 'PRIVATE KEY',
//             text: `Your PRIVATE KEY for Voting : ${part1}`
//         };

//         // Send email/text message
//         await transporter.sendMail(mailOptions);

//         res.json({ message: 'Registration successful' });

//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ error: 'Failed to register user' });
//     }
// };




exports.generateOTP = async (req, res) => {
    console.log("Generate Otp called")
    const { name ,uniqueId , emailOrPhone} = req.body;
    console.log(req.body)
    try {
        // Generate OTP and store it in the hashmap
        const otp = utils.generateAndStoreOTP(name+uniqueId);
        console.log(`new otp for${name} ; ${otp}`)
        // Send OTP to the user (you can implement this part using nodemailer or any other method)

        // nodeMailerPass : wnlg xswu xrtn oycj
         // Create nodemailer transporter
         const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'patchalajohn@gmail.com', // Your Gmail email address
                pass: 'wnlg xswu xrtn oycj' // Your Gmail password
            }
        });

        // Compose email/text message
        const mailOptions = {
            from: 'patchalajohn@gmail.com',
            to: emailOrPhone,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`
        };

        // Send email/text message
        await transporter.sendMail(mailOptions);
        

        res.json({ otp: otp });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ error: 'Failed to generate OTP' });
    }
};
