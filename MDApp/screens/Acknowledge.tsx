import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';

export default function Acknowledge({ navigation }) {
    return (
        <View style={styles.container}>
            <LottieView
                style={styles.animation}
                source={require('../Assets/success.json')}
                autoPlay
                speed={1.5}
                loop={true}
            />
            <View style={tw`w-full h-1/4 flex justify-center bg-green-200 border  border-green-600 rounded-xl`}>
                <Text style={styles.title}>Voting Completed Successfully!</Text>
                <Text style={styles.message}>Thank you for your participation.</Text>
            </View>

            <TouchableOpacity
                onPress={() => {
                    // Add navigation logic here with fade animation
                    navigation.navigate('Home', { animation: 'fade' });
                }}
            >
                <View style={tw`border mt-8 px-8 py-2 rounded-full`}>
                    <Text style={styles.buttonText}>Close</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: 'black'
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#555',
    },
    animation: {
        width: 300,
        height: 300,
    },
    button: {
        borderColor: 'black',
        borderWidth: 2,
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 16,
    },
});






// import React from 'react';
// import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
// import LottieView from 'lottie-react-native';
// import tw from 'twrnc';
// import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

// export default function Acknowledge() {
//     return (
//         <View style={styles.container}>
//             <LottieView
//                 style={styles.animation}
//                 source={require('../Assets/success.json')}
//                 autoPlay
//                 speed={1.5}
//                 loop={true}
//             />
//             <View
//                 style={tw`w-full h-1/4 flex justify-center bg-green-200 rounded-xl`}
//             >

//                 <Text style={styles.title}>Voting Completed Successfully!</Text>
//                 <Text style={styles.message}>Thank you for your participation.</Text>
//             </View>

//             <TouchableNativeFeedback>   
//         <Text>Back to Home</Text>
//             </TouchableNativeFeedback>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 30
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         textAlign: 'center',
//         color: "black"
//     },
//     message: {
//         fontSize: 16,
//         marginBottom: 20,
//         textAlign: 'center',
//         color: '#555',
//     },
//     animation: {
//         width: 300,
//         height: 300,
//     },
// });






// import React from 'react';
// import { View, Text } from 'react-native';
// import LottieView from 'lottie-react-native';

// export default function Acknowledge() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 20, marginBottom: 20 }}>Successfully Voting Completed</Text>
//       <LottieView
//         style={{ width: 200, height: 200 }}
//         source={require('../Assets/success.json')} // Replace 'path_to_your_animation.json' with the actual path to your Lottie animation file
//         autoPlay
//         loop={true}
//       />
//     </View>
//   );
// }




// import { View, Text } from 'react-native'
// import React from 'react'

// export default function Acknowledge() {
//   return (
//     <View>
//       <Text>SuccessFully  Voting Completed</Text>
//     </View>
//   )
// }