import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const Register = ({route, navigation}:any) => {
    const {Ip} = route.params;
    const [name, setName] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    

    const handleGetOtp = () => {
        // Implement logic to send OTP
        const registrationData = {
            name: name,
            uniqueId: uniqueId,
            emailOrPhone: emailOrPhone,
        };
    
        // Send POST request to the server
        fetch(`http://${Ip}/election/genOtp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful registration response
            console.log('Otp successful:', data);
        })
        .catch(error => {
            // Handle error during registration
            console.error('Error during Getting otp:', error);
        });
        setOtpSent(true);
    };

    
    
    const handleRegister = () => {
        // Prepare registration data
        const registrationData = {
            name: name,
            uniqueId: uniqueId,
            emailOrPhone: emailOrPhone,
            otp: otp
        };
    
        // Send POST request to the server
        fetch(`http://${Ip}/election/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        })
        .then(response => {
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful registration response
            // console.log('Registration successful:', data);
            if(data.error){
                Alert.alert("Unsuccessful Registration",data.error)
            }
            else if(data.message){
                navigation.navigate("Message",{msg:data.message,sts :"success"})
            }
        })
        .catch(error => {
            // Handle error during registration
            console.error('Error during registration:', error);
            console.log(error)
        });
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>User Registration</Text>
            <Text>{Ip}</Text>
            <Image
                style={styles.logo}
                source={{ uri: "https://cdn3d.iconscout.com/3d/premium/thumb/man-holding-sign-up-form-2937684-2426382.png?f=webp" }}
            />
            {/* <Image
                style={styles.logo}
                source={require( '../Assets/reg.png')}
            /> */}
            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                label="Unique ID"
                value={uniqueId}
                onChangeText={setUniqueId}
                style={styles.input}
            />
            <TextInput
                label="Email Address or Phone Number"
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                
                style={styles.input}
                keyboardType="email-address" // You can set the keyboardType to 'phone-pad' if collecting phone number
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
                disabled={!otpSent }
                style={styles.input}
                keyboardType='numeric'
            />
            {/* <Button
                mode="contained"
                onPress={handleVerifyOtp}
                style={styles.button}
                disabled={!otp || otpVerified}
            >
                Verify OTP
            </Button> */}
            <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.button}
                disabled={!otp}
            >
               Verify OTP & Register
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
        backgroundColor: "#4b82ff"
    },
    heading:{
        marginTop:-20,
        marginBottom:10,
        color:"#8cafff",
        fontSize:30,
        letterSpacing:-1,
        fontWeight:'900'
    }
});

export default Register;
