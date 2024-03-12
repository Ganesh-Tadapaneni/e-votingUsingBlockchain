import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NetworkSet from "./screens/NetworkSet";
import Message from './screens/Message';
import CandidatesScreen from './screens/CandidatesScreen';
import Transaction from './screens/Transaction';
import Acknowledge from './screens/Acknowledge';
import Id from './screens/Id';
import Register from './screens/Register';
import Login from './screens/Login';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right', // Set animation type to slide from right
        }}
      >
        <Stack.Screen name="Home" component={NetworkSet} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Acknowledge" component={Acknowledge} />
        <Stack.Screen name="Message" component={Message} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Id" component={Id} />
        <Stack.Screen 
          name="Transaction" 
          component={Transaction} 
          options={{ title: 'Vote Confirmation' }} 
        />
        <Stack.Screen 
          name="Candidates" 
          component={CandidatesScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}





// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import NetworkSet from "./screens/NetworkSet"
// import Message from './screens/Message';
// import CandidatesScreen from './screens/CandidatesScreen';
// import Transaction from './screens/Transaction';
// const Stack = createNativeStackNavigator();

// export default function App() {

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={NetworkSet}
//         options={
//           {headerShown:false}
//         }
//         />
//         <Stack.Screen  name="messgae" component={Message} />
//         <Stack.Screen  name="Transaction" component={Transaction} 
//          options={{ title: 'Vote Conformation' }}
//         />
//         <Stack.Screen  name="Candidates" component={CandidatesScreen}
//         options={
//           {headerShown:false}
//         }
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   )
// }