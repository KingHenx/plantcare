import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import PlantList from './components/PlantList';
import Plant from './components/Plant';
import CreateNewPlant from './components/CreateNewPlant';
import SignUp from './components/SignUp';

const Tab = createBottomTabNavigator();

function BottomNavi() {

    const screenOptions = ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeScreen') {
                iconName = 'home';
            } else if (route.name === 'PlantList') {
                iconName = 'leaf';
            } else if (route.name === 'CreateNewPlant') {
                iconName = 'circle-with-plus';
            }

            return <Entypo name={iconName} size={size} color={color} />;
        }
    });

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name='PlantList' component={PlantList} options={{ title: 'PlantList' }} />
            <Tab.Screen name='CreateNewPlant' component={CreateNewPlant} options={{ title: 'Add' }} />
        </Tab.Navigator>
    );
}



const Stack = createStackNavigator();

export default function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
                <Stack.Screen options={{ headerShown: false }} name="BottomNavi" component={BottomNavi} />
                <Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUp} />
                <Stack.Screen options={{ headerShown: false }} name="Plant" component={Plant} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

