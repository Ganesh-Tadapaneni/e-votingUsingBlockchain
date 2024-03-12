import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import tw from 'twrnc';
import axios from 'axios';

const Login = ({ route , navigation}: any) => {
  const { Ip ,cand } = route.params;
  console.log("Login page " + Ip)
  const [privateKey, setPrivateKey] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleGetOtp = async () => {
    try {
      const response = await fetch(`http://${Ip}/election/loginOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privateKey }),
      });
      if (response.ok) {
        setOtpSent(true);
      } else {
        console.error('Error getting OTP:', response.statusText);
      }
    } catch (error) {
      console.error('Error getting OTP:', error);
    }
  };

// Define a style for the alert
const successAlertStyle = StyleSheet.create({
  alert: {
    borderWidth: 2,
    borderColor: '#4CAF50', // Greenish border color
  },
});

// Function to handle login button press in React Native
const handleLogin = async () => {
  try {
    const response = await fetch(`http://${Ip}/election/loginUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp, privateKey }),
    });

    const data = await response.json(); // Parse response JSON
    if (data.sts == "error") {
      Alert.alert("Attention", "Otp Verification Failed, " + data.msg);
    }
    if (data.sts == "success") {
      // Alert for successful verification with greenish border
      // Alert.alert("Attention", "Otp Verification Successful, " + data.msg, null, { style: successAlertStyle.alert });
      
     
      navigation.navigate("Candidates",{privateKey, cand ,Ip})
    }
    if (response.ok) {
      console.log('OTP verified successfully');
      console.log('Response status:', data.sts);
      console.log('Response message:', data.msg);
    } else {
      console.error('Error verifying OTP:', data.msg);
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
  }
};

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{ uri: "https://static.vecteezy.com/system/resources/previews/020/716/745/non_2x/3d-minimal-password-verification-password-authentication-concept-login-success-authorized-user-key-with-padlock-and-green-shield-with-a-check-mark-concept-3d-rendering-illustration-png.png" }}
      />
      <TextInput
        label="Private Key"
        value={privateKey}
        onChangeText={setPrivateKey}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleGetOtp}
        style={styles.button}
        disabled={!privateKey}
      >
        {otpSent ? 'Resend OTP' : 'Get OTP'}
      </Button>
      <TextInput
        label="OTP"
        value={otp}
        onChangeText={setOtp}
        disabled={!otpSent || otpVerified}
        style={styles.input}
        keyboardType='numeric'
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        disabled={!otp || otpVerified}
      >
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff', // White background color
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    fontSize: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
  },
  button: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: "#0041d0"
  },
});

export default Login;





// import React, { useState } from 'react';
// import { View, Image, StyleSheet, Alert } from 'react-native';
// import { TextInput, Button, Text } from 'react-native-paper';
// import tw from 'twrnc';
// import axios from 'axios';

// const Login = ({ route }: any) => {
//   const { Ip } = route.params;
//   console.log("Login page " + Ip)
//   const [privateKey, setPrivateKey] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);

//   const handleGetOtp = async () => {
//     try {
//       const response = await fetch(`http://${Ip}/election/loginOtp`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ privateKey }),
//       });
//       if (response.ok) {
//         setOtpSent(true);
//       } else {
//         console.error('Error getting OTP:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error getting OTP:', error);
//     }
//   };

//   // Function to handle login button press in React Native
//   const handleLogin = async () => {
//     try {
//       const response = await fetch(`http://${Ip}/election/loginUser`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ otp, privateKey }),
//       });

//       const data = await response.json(); // Parse response JSON
//       if(data.sts == "error"){
//         Alert.alert("Attention","Otp Verification Failed ,  " + data.msg)
//       }
//       if(data.sts == "success"){
//         Alert.alert("Attention","Otp Verification Successful ,  " + data.msg)
//       }
//       if (response.ok) {
//         console.log('OTP verified successfully');
//         console.log('Response status:', data.sts);
//         console.log('Response message:', data.msg);
//       } else {
//         console.error('Error verifying OTP:', data.msg);
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image
//         style={styles.logo}
//         source={{ uri: "https://static.vecteezy.com/system/resources/previews/020/716/745/non_2x/3d-minimal-password-verification-password-authentication-concept-login-success-authorized-user-key-with-padlock-and-green-shield-with-a-check-mark-concept-3d-rendering-illustration-png.png" }}
//       />
//       <TextInput
//         label="Private Key"
//         value={privateKey}
//         onChangeText={setPrivateKey}
//         style={styles.input}
//       />
//       <Button
//         mode="contained"
//         onPress={handleGetOtp}
//         style={styles.button}
//         disabled={!privateKey}
//       >
//         {otpSent ? 'Resend OTP' : 'Get OTP'}
//       </Button>
//       <TextInput
//         label="OTP"
//         value={otp}
//         onChangeText={setOtp}
//         disabled={!otpSent || otpVerified}
//         style={styles.input}
//       />
//       <Button
//         mode="contained"
//         onPress={handleLogin}
//         style={styles.button}
//         disabled={!otp || otpVerified}
//       >
//         Login
//       </Button>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#ffffff', // White background color
//   },
//   logo: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   alert: {
//     borderWidth: 2,
//     borderColor: '#4CAF50', // Greenish border color
//   },
//   input: {
//     width: '100%',
//     fontSize: 20,
//     marginBottom: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
//   },
//   button: {
//     width: '100%',
//     marginBottom: 10,
//     backgroundColor: "#0041d0"
//   },
// });

// export default Login;






// import React, { useState } from 'react';








// import { View, Image, StyleSheet } from 'react-native';
// import { TextInput, Button, Text } from 'react-native-paper';
// import tw from 'twrnc';

// const Login = ({ route }: any) => {
//   const { Ip } = route.params;
//   const [privateKey, setPrivateKey] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);

//   const handleGetOtp = () => {
//     // Implement logic to send OTP
//     setOtpSent(true);
//   };

//   const handleLogin = () => {
//     // Implement logic to verify OTP and perform login
//     setOtpVerified(true);
//   };

//   return (
//     <View style={styles.container}>
//       <Image
//         style={styles.logo}
//         source={{ uri: "https://static.vecteezy.com/system/resources/previews/020/716/745/non_2x/3d-minimal-password-verification-password-authentication-concept-login-success-authorized-user-key-with-padlock-and-green-shield-with-a-check-mark-concept-3d-rendering-illustration-png.png" }}
//       />
//       <TextInput
//         label="Private Key"
//         value={privateKey}
//         onChangeText={setPrivateKey}
//         style={styles.input}
//       />
//       <Button
//         mode="contained"
//         onPress={handleGetOtp}
//         style={styles.button}
//       >
//         {otpSent ? 'Resend OTP' : 'Get OTP'}
//       </Button>
//       <TextInput
//         label="OTP"
//         value={otp}
//         onChangeText={setOtp}
//         disabled={!otpSent || otpVerified}
//         style={styles.input}
//       />
//       <Button
//         mode="contained"
//         onPress={handleLogin}
//         style={styles.button}
//         disabled={!otp || otpVerified}
//       >
//         Login
//       </Button>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#ffffff', // White background color
//   },
//   logo: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     fontSize: 20,
//     marginBottom: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
//   },
//   button: {
//     width: '100%',
//     marginBottom: 10,
//     backgroundColor: "#0041d0"
//   },
// });

// export default Login;
