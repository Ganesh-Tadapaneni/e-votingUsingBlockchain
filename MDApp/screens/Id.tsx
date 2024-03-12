import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const Id = () => {
    const [id, setId] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const handleGetOtp = () => {
        // Implement logic to send OTP
        setOtpSent(true);
    };

    const handleVerifyOtp = () => {
        // Implement logic to verify OTP
        setOtpVerified(true);
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={{ uri: "https://static.vecteezy.com/system/resources/previews/020/716/745/non_2x/3d-minimal-password-verification-password-authentication-concept-login-success-authorized-user-key-with-padlock-and-green-shield-with-a-check-mark-concept-3d-rendering-illustration-png.png" }}
            />
            <TextInput
                label="ID"
                value={id}
                onChangeText={setId}
                style={styles.input}
            />
            <Button
                mode="contained"
                onPress={handleGetOtp}
                style={styles.button}
            >
                {otpSent ? 'Resend OTP' : 'Get OTP'}
            </Button>
            <TextInput
                label="OTP"
                value={otp}
                onChangeText={setOtp}
                disabled={!otpSent || otpVerified}
                style={styles.input}
            />
            <Button
                mode="contained"
                onPress={handleVerifyOtp}
                style={styles.button}
                disabled={!otp || otpVerified}
            >
                Verify OTP
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
        fontSize:20,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    },
    button: {
        width: '100%',
        marginBottom: 10,
        backgroundColor:"#0041d0"
    },
});

export default Id;




// import React, { useState } from 'react';
// import { View, Text, TextInput } from 'react-native';
// import { Button } from 'react-native-paper';
// import tw from 'twrnc';

// const Id = () => {
//     const [id, setId] = useState('');
//     const [otp, setOtp] = useState('');
//     const [isOtpVisible, setIsOtpVisible] = useState(false);

//     const handleGetOtp = () => {
//         // Add logic to get OTP
//         setIsOtpVisible(true);
//     };

//     const handleVerifyOtp = () => {
//         // Add logic to verify OTP
//     };

//     return (
//         <View style={tw`p-4`}>
//             <Text style={tw`text-lg font-bold mb-4`}>Enter ID</Text>
//             <TextInput
//                 style={tw`border rounded-lg px-4 py-2 mb-4`}
//                 placeholder="Enter ID"
//                 value={id}
//                 onChangeText={setId}
//             />
//             {isOtpVisible && (
//                 <>
//                     <Text style={tw`text-lg font-bold mb-4`}>Enter OTP</Text>
//                     <TextInput
//                         style={tw`border rounded-lg px-4 py-2 mb-4`}
//                         placeholder="Enter OTP"
//                         value={otp}
//                         onChangeText={setOtp}
//                         keyboardType="numeric"
//                     />
//                     <Button
//                         mode="contained"
//                         style={tw`bg-blue-500`}
//                         onPress={handleVerifyOtp}
//                     >
//                         Verify OTP
//                     </Button>
//                 </>
//             )}
//             {!isOtpVisible && (
//                 <Button
//                     mode="contained"
//                     style={tw`bg-blue-500 `}
//                     onPress={handleGetOtp}
//                 >
//                     Get OTP
//                 </Button>
//             )}
//         </View>
//     );
// };

// export default Id;
