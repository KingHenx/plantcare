import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button, FlatList, TouchableOpacity } from 'react-native';
import Firebase, { firebaseAuth } from '../config/Firebase';
import { Entypo } from '@expo/vector-icons';


export default function PlantList({ navigation }) {

    const [plants, setPlants] = useState([]);
    const currentUser = firebaseAuth.currentUser ? firebaseAuth.currentUser : null;
    const [date, setDate] = useState();

    const handleLogout = () => {
        firebaseAuth.signOut()
            .then(() => navigation.navigate('Home'))
            .catch(error => console.log(error));
    }

    const getPlants = () => {

        try {
            Firebase.database()
                .ref('/plants')
                .on('value', snapshot => {
                    const data = snapshot.val();
                    const p = Object.values(data);
                    const owned = p.filter(plant => plant.owner === firebaseAuth.currentUser.uid);
                    setPlants(owned);
                });
        } catch (error) {
            console.log("ALERT! Error finding plants " + error);
        }
    }

    useEffect(() => {
        const enter = navigation.addListener('focus', () => {
            getPlants();
            setDate(new Date());
        });
        return enter;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Your Plants</Text>
            </View>
            <View style={styles.list}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                        <View style={styles.listcontainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('Plant', item)}>
                                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                                    <Entypo name={item.icon} size={30} color='green' /> {item.name}
                                </Text>
                            </TouchableOpacity>
                        </View>}
                    data={plants}
                />
            </View>

            <Button title='logout' onPress={() => handleLogout()} />

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listcontainer: {
        width: 350,
        borderWidth: 2,
        marginBottom: 10,
        padding: 5,
        borderColor: '#029B76'
    },
    distance: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    btn: {
        backgroundColor: '#029B76',
        borderRadius: 5
    },
    btnText: {
        color: 'white',
        padding: 10,
        fontSize: 20
    }



});
