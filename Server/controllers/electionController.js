const { Web3 } = require('web3');
const ganache = require('ganache-cli');
const contractData = require('../build/contracts/Election.json');

// Initialize web3 and contract instance
const web3 = new Web3('http://127.0.0.1:8545'); // Assuming Ganache cli is running on the default port
const contractABI = contractData.abi;
const utils = require('./utils');
const nodemailer = require('nodemailer');

//replace double check of network address
const contractAddress = contractData.networks['1710258336597'].address; // Adjust network ID accordingly
const contract = new web3.eth.Contract(contractABI, contractAddress);
//acc -- public key key updated 
const acc = "0x4ddDcb255d75B9f7817bcC7e01E280DEA0001213";
const privateKey = "0x1c4708790e6902703775567ddd51826459d627b93a9de6a4a89b96a265b6b0a6";
const mysql = require('mysql2/promise'); // Import mysql2 module
const sha256 = require('sha256');
// MySQL database configuration
const dbConfig = {
    host: 'localhost', // Remove the port number from here
    port: 3306, // Port should be specified separately
    user: 'root',
    password: '1234',
    database: 'Voting'
};


// Controller functions
exports.getStatus = async (req, res) => {
    try {
        let sts = await contract.methods.registrationsOpen().call()
        let sts2 = await contract.methods.votingClosed().call()
        console.log(sts)
        res.json({
            registrationsOpen: sts,
            votingClosed: sts2
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch voting' });
    }
};

exports.getAllContenders = async (req, res) => {
    try {
        const allContenders = await contract.methods.getAllContenders().call();
        // Convert BigInt values to regular numbers
        // console.log(allContenders)
        const formattedContenders = allContenders.map(contender => ({
            id: Number(contender.id),
            name: contender.name,
            voteCount: Number(contender.voteCount)
        }));
        res.json({ contenders: formattedContenders });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch contenders' });
    }
};


exports.getContenderVoteCount = async (req, res) => {
    const { id } = req.params;
    try {
        const voteCount = await contract.methods.getContenderVoteCount(id).call();
        res.json({ voteCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vote count' });
    }
};


// register and gen otp
const { Register, generateOTP } = require('./registrationController');
exports.Register = Register;
exports.genOtp = generateOTP;

exports.addContender = async (req, res) => {
    const { name } = req.body;
    console.log(name);
    try {
        const isRegistrationOpen = await contract.methods.votingClosed().call();

        if (isRegistrationOpen) {
            return res.status(400).json({ error: 'Voting is Closed. Cannot add contender.' });
        }

        const encodedABI = contract.methods.addContender(name).encodeABI();
        const signedTx = await web3.eth.accounts.signTransaction(
            {
                to: contractAddress,
                data: encodedABI,
                gas: 2000000, // Adjust gas value as needed
                gasPrice: '10000000000', // You can adjust gas price as needed
                nonce: await web3.eth.getTransactionCount(acc) // Provide nonce here
            },
            privateKey
        );
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);
        res.json({ message: 'Contender added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add contender' });
    }
};

// exports.addContender = async (req, res) => {
//     const { name } = req.body;
//     console.log(name);
//     try {
//         const encodedABI = contract.methods.addContender(name).encodeABI();
//         const signedTx = await web3.eth.accounts.signTransaction(
//             {
//                 to: contractAddress,
//                 data: encodedABI,
//                 gas: 2000000, // Adjust gas value as needed
//                 gasPrice: '10000000000', // You can adjust gas price as needed
//                 nonce: await web3.eth.getTransactionCount(acc) // Provide nonce here
//             },
//             privateKey
//         );
//         const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
//         console.log(receipt);
//         res.json({ message: 'Contender added successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to add contender' });
//     }
// };


exports.vote = async (req, res) => {
    const { id } = req.params;
    const { privateKey } = req.body;

    console.log("Candidate id: " + id);
    console.log("Request body: ", req.body);

    try {
        // Query the database to check if the public key exists
        const connection = await mysql.createConnection(dbConfig);
        const [rows, fields] = await connection.execute('SELECT * FROM users WHERE publicKey = ?', [sha256(privateKey)]);
        console.log(rows[0]);

        if (!rows.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Reconstruct the original private key from the shares
        const orgPrivateKey = utils.reconstructPrivateKey([privateKey, rows[0].privateKey]);
        console.log("Derived key: " + orgPrivateKey);

        // Convert the private key to a buffer
        const privateKeyBuffer = Buffer.from(orgPrivateKey, 'hex');

        // Create a Web3 instance
        const web3 = new Web3('http://localhost:8545');

        // Generate the account from the private key
        const account = web3.eth.accounts.privateKeyToAccount(privateKeyBuffer);
        console.log("account : "+ JSON.stringify(account));

        // Add the account to Ganache's wallet
        web3.eth.accounts.wallet.add(account);

        const voterAddress = account.address;

        // Initialize the contract instance
        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

        // Check if the user has already voted
        const hasAlreadyVoted = await contractInstance.methods.hasVoted(voterAddress).call();
        if (hasAlreadyVoted) {
            return res.json({ error: 'You have already voted' });
        }

        // Send the transaction to the smart contract to cast the vote
        const result = await contractInstance.methods.vote(parseInt(id)).send({ from: voterAddress });
        console.log(result);
        res.json({ success : 'Vote submitted successfully' });
    } catch (error) {
        console.error('Error submitting vote:', error);
        res.status(500).json({ error: 'Failed to submit vote' });
    }
};


// exports.vote = async (req, res) => {
//     const { id } = req.params;
//     const { privateKey } = req.body;

//     console.log("Candidate id: " + id);
//     console.log("Request body: ", req.body);

//     try {
//         // Query the database to check if the public key exists
//         const connection = await mysql.createConnection(dbConfig);
//         const [rows, fields] = await connection.execute('SELECT * FROM users WHERE publicKey = ?', [sha256(privateKey)]);
//         console.log(rows[0]);

//         if (!rows.length) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Reconstruct the original private key from the shares
//         const orgPrivateKey = utils.reconstructPrivateKey([privateKey, rows[0].privateKey]);
//         console.log("Derived key: " + orgPrivateKey);

//         // Convert the private key to a buffer
//         const privateKeyBuffer = Buffer.from(orgPrivateKey, 'hex');

//         // Create a Web3 instance
//         const web3 = new Web3('http://localhost:8545');

//         // Generate the account from the private key
//         const account = web3.eth.accounts.privateKeyToAccount(privateKeyBuffer);
//         console.log("account : "+ JSON.stringify(account));
//         const voterAddress = account.address;

//         // Initialize the contract instance
//         const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

//         // Send the transaction to the smart contract to cast the vote
//         const res =  await contractInstance.methods.vote(parseInt(id)).send({ from: voterAddress });
//         console.log(res)
//         res.json({ message: 'Vote submitted successfully' });
//     } catch (error) {
//         console.error('Error submitting vote:', error);
//         res.status(500).json({ error: 'Failed to submit vote' });
//     }
// };



// exports.vote = async (req, res) => {
//     const { id } = req.params;
//     const { privateKey } = req.body;

//     console.log("candidate id : " + id)
//     console.log(req.body)
//     const hPk = sha256(privateKey);

//     // Query the database to check if the private key exists
//     const connection = await mysql.createConnection(dbConfig);
//     const [rows, fields] = await connection.execute('SELECT * FROM users WHERE publicKey = ?', [hPk]);
//     console.log(rows[0])
//     console.log(utils.reconstructPrivateKey([privateKey, rows[0].privateKey]));
//     const orgPrivateKey = utils.reconstructPrivateKey([privateKey, rows[0].privateKey]);

//     return
//     try {
//         await contract.methods.vote(parseInt(id)).send({ from: 'VoterAddress' });
//         res.json({ message: 'Vote submitted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to submit vote' });
//     }
// };

exports.closeVoting = async (req, res) => {
    try {
        await contract.methods.closeVoting().send({ from: acc });
        res.json({ message: 'Voting closed successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to close voting' });
    }
};

exports.closeRegistration = async (req, res) => {
    try {
        await contract.methods.closeRegistrations().send({ from: acc });
        res.json({ message: 'Registrations closed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to close voting' });
    }
};

exports.openRegistration = async (req, res) => {
    try {
        await contract.methods.openRegistrations().send({ from: acc });
        res.json({ message: 'Registrations opened successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to open Registrations' });
    }
};

exports.openVoting = async (req, res) => {
    try {
        await contract.methods.openVoting().send({ from: acc });
        res.json({ message: 'Voting opened successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to open voting' });
    }
};

exports.getBalance = async (req, res) => {
    const { address } = req.params;
    console.log(address);
    try {
        // Get the balance of the address directly from Ganache
        const balance = await web3.eth.getBalance(address);
        // Convert balance from Wei to Ether
        const balanceInEther = web3.utils.fromWei(balance, 'ether');
        res.json({ balance: balanceInEther });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch balance' });
    }
};

// exports.LoginOtp = async (req,res)=>{
// }
exports.LoginOtp = async (req, res) => {
    try {
        const { privateKey } = req.body;
        const hPk = sha256(privateKey);
        console.log("hashed private key : " + hPk)
        console.log(privateKey)
        // Query the database to check if the private key exists
        const connection = await mysql.createConnection(dbConfig);
        const [rows, fields] = await connection.execute('SELECT * FROM users WHERE publicKey = ?', [hPk]);
        console.log(rows[0])


        // console.log("========== Decoeded Orginal Private Key ===========")

        console.log(utils.reconstructPrivateKey([privateKey, rows[0].privateKey]))
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Private key not found' });
        }

        // Generate OTP
        const otp = utils.generateAndStoreOTP(hPk); // Implement your OTP generation logic here
        console.log(otp)
        // Send OTP to the corresponding email
        // await sendOTP(rows[0].email, otp);

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
            to: rows[0].emailOrPhone,
            subject: 'OTP FOR LOGIN',
            text: `Your Otp to Login for Voting : ${otp}`
        };

        // Send email/text message
        await transporter.sendMail(mailOptions);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error in LoginOtp:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};
exports.LoginUser = async (req, res) => {
    const { privateKey , otp} = req.body;
    const hPk = sha256(privateKey);
    console.log(req.body)
    console.log( "Otp Value : "+utils.getOTP(hPk))
    console.log(otp === utils.getOTP(hPk));


    
    

    if(otp === utils.getOTP(hPk)){
        res.json({msg:" Otp Successful Verified", sts:"success"})
    }else {

        res.json({msg:"Invalid Otp", sts:"error"})
    }
}






// const {Web3} = require('web3');
// const contractData = require('../build/contracts/Election.json');

// // Initialize web3 and contract instance
// const web3 = new Web3('http://localhost:7545'); // Assuming Ganache is running on the default port
// const contractABI = contractData.abi;
// const contractAddress = contractData.networks['5777'].address; // Adjust network ID accordingly
// const contract = new web3.eth.Contract(contractABI, contractAddress);
// const acc = "0x7B88F12c7c61cB6a9Fb9c86f6aE9aeeef9450Bfe"
// // Controller functions
// exports.getAllContenders = async (req, res) => {
//     try {
//         const allContenders = await contract.methods.getAllContenders().call();
//         res.json({ contenders: allContenders });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch contenders' });
//     }
// };

// exports.getContenderVoteCount = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const voteCount = await contract.methods.getContenderVoteCount(id).call();
//         res.json({ voteCount });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch vote count' });
//     }
// };

// exports.addContender = async (req, res) => {
//     const { name } = req.body;
//     console.log(name)
//     try {
//         await contract.methods.addContender(name).send({ from: acc });
//         res.json({ message: 'Contender added successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to add contender' });
//     }
// };

// exports.vote = async (req, res) => {
//     const { id } = req.params;
//     try {
//         await contract.methods.vote(id).send({ from: 'VoterAddress' });
//         res.json({ message: 'Vote submitted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to submit vote' });
//     }
// };

// exports.closeVoting = async (req, res) => {
//     try {
//         await contract.methods.closeVoting().send({ from: 'YourOwnerAddress' });
//         res.json({ message: 'Voting closed successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to close voting' });
//     }
// };

// exports.getBalance =  async (req, res) => {
//     const { address } = req.params;
//     console.log(address)
//     try {
//         // Get the balance of the address directly from Ganache
//         const balance = await web3.eth.getBalance(address);
//         // Convert balance from Wei to Ether
//         const balanceInEther = web3.utils.fromWei(balance, 'ether');
//         res.json({ balance: balanceInEther });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch balance' });
//     }
// }


