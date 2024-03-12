const {Web3} = require('web3');
const contractData = require('../build/contracts/Election.json');

// Initialize web3 and contract instance
const web3 = new Web3('http://127.0.0.1:8545'); // Assuming Ganache cli is running on the default port
const contractABI = contractData.abi;
const contractAddress = contractData.networks['5777'].address; // Adjust network ID accordingly
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Set account information
const acc = "0x8922e2BD6939577b7940982AC7975776A89a1e38";
const privateKey = "0xa4ee6f67954f4862e4aee492f25e3f37dcd31f69cca30dd1db39e90ca3b9fd8d";

// Controller function to get status
exports.getStatus = async (req, res) => {
    try {
        let sts = await contract.methods.registrationsOpen().call()
        let sts2 = await contract.methods.votingClosed().call()
        console.log(sts)
        res.json({ 
            registrationsOpen : sts,
            votingClosed : sts2
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch voting' });
    }
};

// Controller function to get all contenders
exports.getAllContenders = async (req, res) => {
    try {
        const allContenders = await contract.methods.getAllContenders().call();
        // Convert BigInt values to regular numbers
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

// Controller function to get contender vote count
exports.getContenderVoteCount = async (req, res) => {
    const { id } = req.params;
    try {
        const voteCount = await contract.methods.getContenderVoteCount(id).call();
        res.json({ voteCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vote count' });
    }
};

// Controller function to register
exports.Register = async (req, res) => {
    const { name } = req.body;
    console.log(req.body);
    res.json({msg:"register hitted"})
};

// Controller function to add a contender
exports.addContender = async (req, res) => {
    const { name } = req.body;
    console.log(name);
    try {
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

// Controller function to submit a vote
exports.vote = async (req, res) => {
    const { id } = req.params;
    try {
        await contract.methods.vote(parseInt(id)).send({ from: 'VoterAddress' });
        res.json({ message: 'Vote submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit vote' });
    }
};

// Controller function to close voting
exports.closeVoting = async (req, res) => {
    try {
        await contract.methods.closeVoting().send({ from: 'YourOwnerAddress' });
        res.json({ message: 'Voting closed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to close voting' });
    }
};

// Controller function to close registration
exports.closeRegistration = async (req, res) => {
    try {
        await contract.methods.closeRegistrations().send({ from: acc });
        res.json({ message: 'Registrations closed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to close voting' });
    }
};

// Controller function to open registration

