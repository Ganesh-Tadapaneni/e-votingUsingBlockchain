const express = require('express');
const router = express.Router();
const { getAllContenders,Register,genOtp,LoginOtp, LoginUser,openRegistration,openVoting, closeRegistration,getStatus, getContenderVoteCount, addContender, vote, closeVoting, getBalance } = require('../controllers/electionController');

// Routes
router.get('/contenders', getAllContenders);
router.get('/status', getStatus );
router.post('/loginOtp', LoginOtp );
router.post('/loginUser', LoginUser );
router.get('/closeReg', closeRegistration );
router.get('/openReg', openRegistration );
router.get('/openVoting', openVoting );
router.get('/contenders/:id/votes', getContenderVoteCount);
router.post('/contenders', addContender);
router.post('/register', Register);
router.post('/genOtp', genOtp);
router.post('/vote/:id', vote);
router.get('/close-voting', closeVoting);
router.get('/getBalance/:address',getBalance);

module.exports = router;
