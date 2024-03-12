import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, ToastAndroid, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';



export default function NetworkSet({ navigation }: any) {
    const [Ip, setIp] = useState('');
    const [msg, setMsg] = useState('');

    // const FTC = async () => {
    //     if (!Ip) {
    //         // Show toast or alert for invalid IP
    //         return;
    //     }

    //     try {
    //         // Fetch data from IP
    //         const response = await fetch(`http://${Ip}`);
    //         const json = await response.json();
    //         setMsg(json.msg);

    //         // Perform navigation based on response
    //         if (json.msg) {
    //             navigation.navigate("Message", { msg: json.msg });
    //         } else {
    //             // Show toast or alert for message not received
    //         }
    //     } catch (error) {
    //         // Handle error fetching data
    //     }
    // };
    
    async function FTC() {
        if (!Ip) {
            ToastAndroid.show('Please enter a valid IP', ToastAndroid.SHORT);
            return;
        }
    
        try {
            let response = await fetch(`http://${Ip}/election/status`, {
                method: "GET",
            });
    
            let data = await response.json();
            console.log(data);
    
            if (data.registrationsOpen && data.votingClosed) {
                ToastAndroid.show('Registrations are Open', ToastAndroid.SHORT);
                navigation.navigate("Register", { cand: data.contenders, Ip });
            } else if (!data.registrationsOpen && !data.votingClosed) {


                let headersList = {
                    "Accept": "*/*",
                    "User-Agent": "Thunder Client (https://www.thunderclient.com)"
                   }
                   
                   let response = await fetch(`http://${Ip}/election/contenders`, { 
                     method: "GET",
                     headers: headersList
                   });
                   
                   let data = await response.json();
                   console.log(data);
                   
                ToastAndroid.show('Registrations are Closed and Voting is Open', ToastAndroid.SHORT);
                // Alert.alert("Attention", "Registrations are Closed and Voting is Open");
                navigation.navigate("Login", { Ip , cand : data.contenders});
            } else if (!data.registrationsOpen && data.votingClosed) {
                ToastAndroid.show('Registrations are Closed and Voting is Closed', ToastAndroid.SHORT);
                Alert.alert("Attention", "Registrations are Closed and Voting is Closed");
            } else {
                ToastAndroid.show('Unexpected response from server', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log(error);
            ToastAndroid.show('Error fetching data. Please provide a valid IP.', ToastAndroid.SHORT);
        }
    }
    
    return (
        <View style={styles.container}>
            
            <TextInput
                style={styles.input}
                label="IP ADDRESS"
                value={Ip}
                onChangeText={text => setIp(text)}
                keyboardType='numeric'
            />
            <Button style={styles.button} onPress={FTC} mode='contained'>Connect to Network</Button>
            <Text style={styles.message}>{msg}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    iconContainer: {
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginBottom: 20,
    },
    button: {
        width: '100%',
        marginBottom: 20,
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        color: 'black',
    },
});










// import { View, Text, FlatList, ToastAndroid, TouchableOpacity, Alert } from 'react-native';
// import { useEffect, useState } from 'react';
// import tw from 'twrnc';
// import { TextInput, Button } from 'react-native-paper';

// interface todo {
//     id: number,
//     title: String,

// }
// export default function NetworkSet({ navigation }:any) {
//     const [data, setdata] = useState([])
//     const [msg, setmsg] = useState([])
//     const [Ip, setIp] = useState('')
//     const dat = [1, 2, 3, 4, 5, 6, 7, 8, 9]
//     // useEffect(() => {
//     //   async function name() {
//     //     fetch('https://jsonplaceholder.typicode.com/todos')
//     //       .then(response => response.json())
//     //       .then(json => { setdata(json); })
//     //   }
//     //   name();
//     //   showToast()
//     // }, []);
//     // async function FTC() {
//     //     if (!Ip) {
//     //         ToastAndroid.show('please Valid IP', ToastAndroid.SHORT);
//     //         return
//     //     }
//     //     try {
//     //         fetch(`http://${Ip}`)
//     //             .then(response => response.json())
//     //             .then(json => {
//     //                 console.log(json)
//     //                 setmsg(json.msg)
//     //             })

//     //     } catch (error) {
//     //         console.log(error)
//     //     }

//     //     if (msg) {
//     //         ToastAndroid.show('please Valid IP , message not got', ToastAndroid.SHORT);
//     //         return
//     //     }
//     //     console.log(typeof (msg))
//     //     navigation.navigate("messgae", {
//     //         msg: msg
//     //     })
//     // }
//     async function FTC() {
//         if (!Ip) {
//             ToastAndroid.show('Please enter a valid IP', ToastAndroid.SHORT);
//             return;
//         }

//         try {
//             const response = await fetch(`http://${Ip}`);
//             const json = await response.json();
//             console.log(json);
//             setmsg(json.msg);

//             let response2 = await fetch("http://192.168.1.10/election/status", {
//                 method: "GET",
                
//             });

//             let data = await response2.json();
//             console.log(data);
//             // navigation.navigate("Id", { cand : data.contenders });
//             // navigation.navigate("Candidates", { cand : data.contenders });
//             if(data.registrationsOpen && data.votingClosed){

//                 ToastAndroid.show('Register are Open', ToastAndroid.SHORT);
//                 navigation.navigate("Register", { cand : data.contenders,Ip });

//             }
//             else if(!data.registrationsOpen && data.votingClosed){

//                 ToastAndroid.show('Registration are Closed and Voting not Open', ToastAndroid.SHORT);
//                 Alert.alert("Attention Please","Registration are Closed and Voting not Open");
//                 // navigation.navigate("Message", { msg: "Register are Closed and Voting not Open" });

//             }

//             // Only navigate if msg is available
//             if (json.msg) {
//                 // navigation.navigate("messgae", { msg: json.msg });
//             } else {
//                 ToastAndroid.show('Message not received from server', ToastAndroid.SHORT);
//             }
//         } catch (error) {
//             console.log(error);
//             ToastAndroid.show('Please Give Valid IP , Error fetching data', ToastAndroid.SHORT);
//         }
//     }

//     const showToast = () => {
//         ToastAndroid.show(Ip, ToastAndroid.SHORT);
//     };
//     return (
//         <View style={{
//             flex: 1,

//             justifyContent: `center`,
//             alignItems: `center`,
//             padding: 15
//         }}>
//             <TextInput
//                 style={tw`w-full`}
//                 label="IP ADDRESS"
//                 value={Ip}
//                 onChangeText={text => setIp(text)}
//             />
//             <Text style={tw`text-black text-4xl my-4`}>{Ip}</Text>
//             <Button style={tw`mb-4`} onPress={FTC} mode='contained'>Connect to Network</Button>
//             {/* {
//         data.map((d,i) =><Text key={i}>{d.name}</Text>)
//       } */}
//             {/*<FlatList
//         data={data}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             activeOpacity={0.6}

//           >
//             <View
//             style={{display:`flex`,flexDirection:`row`}}
//             >

//               <Text
//                 style={tw`p-4  bg-white rounded-full mb-4 shadow-lg text-black ${ item.completed? `bg-green-500`:`bg-red-500` }`}
//               >{item.title}</Text>
//               <View

//                 style={tw`w-4 h-8  mb-2`}></View>
//             </View>
//           </TouchableOpacity>

//         )}

//       />*/}
//             <Text style={tw`text-black text-xl`}>{msg}</Text>
//         </View>
//     )
// }