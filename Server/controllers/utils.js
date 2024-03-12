// utils.js

const otpMap = new Map(); // Global hashmap to store OTPs temporarily

// Generate OTP and store it in the hashmap
exports.generateAndStoreOTP = (username) => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
    otpMap.set(username, otp.toString()); // Store OTP in the hashmap with the username as the key
    console.log(otpMap)
    return otp;
};

// Get OTP from the hashmap
exports.getOTP = (username) => {
    return otpMap.get(username);
};

// Delete OTP from the hashmap
exports.deleteOTP = (username) => {
    otpMap.delete(username);
};



const sss = require("shamirs-secret-sharing");

// Function to split the private key into shares
exports.splitPrivateKey = (privateKeyHex, numShares = 2, threshold = 2) => {
    try {
      // Convert private key from hex string to Buffer
      const privateKeyBuffer = Buffer.from(privateKeyHex.replace(/^0x/, ""), "hex");
    
      // Split the private key into shares
      const shares = sss.split(privateKeyBuffer, { shares: numShares, threshold });
    
      // Convert each share to a hex string
      const shareStrings = shares.map((share) => share.toString("hex"));
    
      return shareStrings;
    } catch (error) {
      console.error('Error splitting private key:', error);
      return [];
    }
  };
  

// exports.splitPrivateKey=(privateKeyHex, numShares = 2, threshold = 2) => {
//   const privateKeyBuffer = Buffer.from(privateKeyHex, "hex");
//   const shares = sss.split(privateKeyBuffer, { shares: numShares, threshold });
//   return shares.map((share) => share.toString("hex"));
// }

// Function to reconstruct the original private key from shares
exports.reconstructPrivateKey =(shares) => {
  const shareBuffers = shares.map((share) => Buffer.from(share, "hex"));
  return sss.combine(shareBuffers).toString("hex");
}


