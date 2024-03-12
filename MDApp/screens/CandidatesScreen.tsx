


import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc';


export default function CandidatesScreen({ route , navigation }) {
    const { cand , privateKey, Ip} = route.params;
    console.log(cand)
    const [name, setName] = useState('')
    const [Id, setId] = useState(null)
    return (
        <View

            style={tw`p-5 py-8 w-full flex-1 flex  justify-between items-center bg-blue-100`}
        >
            <View
                style={tw`w-full`}
            >

                <Text
                    style={tw`text-blue-500 text-3xl font-black my-4 ml-5 mb-4`}
                >Candidiates List </Text>
                <FlatList
                    data={cand}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={tw`pl-5 pr-5`}
                            onPress={() => {
                                setName(item.name);
                                setId(item.id)
                            }}
                        >

                            <View style={tw` w-full border  border-blue-300 flex items-center justify-center py-8 my-1 rounded-full ${item.name == name ? "bg-blue-500" : ""} `}><Text style={tw` text-black text-2xl ${item.name == name ? "font-black text-white " : ""}`}> {item.name} </Text></View>
                        </TouchableOpacity>

                    )}

                />
            </View>

            <TouchableOpacity
                activeOpacity={0.5}
                onPress={()=>navigation.navigate("Transaction",{cand : name, cId : Id, privateKey, Ip})}
                style={tw`w-full bg-black py-4 flex items-center justify-center rounded-full`}
            >
                <Text
                    style={tw`text-white font-medium text-xl`}
                >Submit Vote</Text>
            </TouchableOpacity>
        </View>
    )
}