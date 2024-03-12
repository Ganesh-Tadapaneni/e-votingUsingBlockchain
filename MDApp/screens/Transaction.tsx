import React from 'react';
import { View, Text, TouchableOpacity, Alert} from 'react-native';
import tw from 'twrnc';
import axios from 'axios';

export default function Transaction({ route, navigation }:any) {
    const { cand, privateKey, Ip, cId } = route.params;
    const handleVote = async () => {
        try {
            // Make a POST request to the /election/vote/:id endpoint with the candidate ID
            const response = await axios.post(`http://${Ip}/election/vote/${cId}`, {
                privateKey,
            });

            if (response.data.success) {
                console.log('Vote cast successfully');
                navigation.navigate("Acknowledge");
                // Handle success scenario, e.g., show a success message
            } else {
                console.log('Vote casting failed:', response.data.error);
                Alert.alert("Vote casting failed",response.data.error)
                // Handle failure scenario, e.g., show an error message
            }
        } catch (error) {
            console.error('Error casting vote:', error);
            // Handle error scenario, e.g., show an error message
        }
    };

    return (
        <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
            <Text style={tw`text-3xl font-semibold text-center mb-8`}>Confirm Vote</Text>
            <View style={tw`bg-white p-4 rounded-lg shadow-md w-80 items-center justify-center`}>
                <Text style={tw`text-lg text-black text-center mb-4`}>You are going to vote for:({cId})</Text>
                <Text style={tw`text-2xl font-bold text-blue-500 mb-6`}>{cand} </Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={tw`bg-blue-500 rounded-lg px-6 py-3`}
                    onPress={() => {
                        console.log('Vote confirmed');
                        // navigation.navigate("Acknowledge")
                    }} // Add functionality for confirming vote
                >
                    <Text style={tw`text-white font-bold text-lg`}
                        onPress={ handleVote}
                    >Confirm Vote</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}




// import { View, Text } from 'react-native'
// import React from 'react';
// import tw from 'twrnc';


// export default function Transaction({route}) {
//     const { cand } = route.params;

//   return (
//     <View>
//         <Text
//       style={
//         tw`text-2xl text-black`
//       }
//       >Conform Vote </Text>
//       <Text
//       style={
//         tw`text-2xl text-black`
//       }
//       >your are Going to Vote to {cand} Person</Text>
//     </View>
//   )
// }