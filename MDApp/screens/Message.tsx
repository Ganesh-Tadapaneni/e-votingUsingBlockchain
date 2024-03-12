// import { View, Text } from 'react-native'
// import React from 'react'
// import tw from 'twrnc';


// const Message = ({route}) => {
//     const { msg } = route.params;
//     setTimeout(() => {
      
//     }, 2000);

//   return (
//     <View
//     style={tw`w-full flex-1 h-full justify-center items-center`}> 
//       <Text style={tw`text-black text-xl`}>{msg}</Text>
//     </View>
//   )
// }

// export default Message

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';

const Message = ({ route }) => {
    const { msg ,sts} = route.params;

    useEffect(() => {
        setTimeout(() => {
            // Add logic to navigate or perform other actions after a delay
            console.log('Message display timeout reached');
        }, 2000);
    }, []);

    return (
        <View style={styles.container}>
            <View style={{...styles.card,backgroundColor:(sts =="success")?"#c2f970":"#FDE047"}}>
                
                <Text style={styles.message}>{msg}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
    card: {
        backgroundColor: '#FDE047', // Yellow background color
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    message: {
        marginTop: 10,
        fontSize: 19,
        color: '#000000', // Black text color
    },
});

export default Message;
