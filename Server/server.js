// const express = require('express');
// const app = express();
// const {Web3 } = require('web3');

// const web3 = new Web3('http://localhost:7545'); // Assuming Ganache is running on the default port



// // Load contract ABI and address from JSON file
// const contractData = require('./build/contracts/Election.json');
// const contractABI = contractData.abi;
// const contractAddress = contractData.networks['5777'].address; // Adjust network ID accordingly

// // Create contract instance
// const contract = new web3.eth.Contract(contractABI, contractAddress);


 const fs = require('fs')
 const path = require('path')

// app.get(`/`,(req,res)=>{
    
//     res.json({

//         msg:"JOHN SERVER WORKING network test"
//     }
//     )
// })

// // Example route to interact with your contract
// app.get('/getBalance/:address', async (req, res) => {
//     const { address } = req.params;
//     try {
//         // Get the balance of the address directly from Ganache
//         const balance = await web3.eth.getBalance(address);
//         // Convert balance from Wei to Ether
//         const balanceInEther = web3.utils.fromWei(balance, 'ether');
//         res.json({ balance: balanceInEther });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch balance' });
//     }
// });

// app.listen(80,"192.168.1.10",)



const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const electionRoutes = require('./routes/electionRoutes');

// Middleware
app.use(bodyParser.json());
app.use((req,res,next)=>{console.log("SERVER HITTED"); next()})
// Routes
app.use('/election', electionRoutes);

app.get(`/`,(req,res)=>{
    
    res.json({

        msg:"JOHN SERVER WORKING network test"
    }
    )
})
// Example route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Server
const PORT = 80;
const IP = "192.168.1.5";
app.listen(PORT,IP, () => {
    console.log(`Server is running on${IP} port ${PORT}`);
});
