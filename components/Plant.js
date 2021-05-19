import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Alert, Button, Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Tooltip } from 'react-native-elements';
import Firebase from '../config/Firebase';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function Plant({ navigation, route }) {

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const schedulePushNotification = async (text, seconds) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "PlantCare",
                body: text
            },
            trigger: { seconds: seconds },
        });
    }

    const [plant, setPlant] = useState(route.params);
    const [days, setDays] = useState(0);

    useEffect(() => {
        const enter = navigation.addListener('focus', () => {
            atStart();
        });
        return enter;
    }, [navigation]);

    const atStart = async () => {
        await getPlant(route.params.key);
        howManyDays();
    }

    const waterPlant = async () => {
        try {

            plant.lastWatering = new Date().toString();

            await Firebase.database().ref('plants/' + plant.key).update(
                {
                    lastWatering: plant.lastWatering
                }
            );

            console.log("gave water to " + plant.name);

            await getPlant(plant.key);

            await schedulePushNotification(
                plant.name + " needs water",
                plant.waterTime * 24 * 60 * 60
            );

            Alert.alert("Plant has been watered");

            howManyDays();
        } catch (error) {
            console.log("Error updating last watering " + error);
        }
    };

    const howManyDays = () => {

        let lastDate = new Date(plant.lastWatering);
        let waterDay = new Date(lastDate);
        waterDay.setDate(lastDate.getDate() + plant.waterTime);

        let timeDiff = waterDay.getTime() - new Date().getTime();
        let dayDiff = timeDiff / (1000 * 3600 * 24);

        let daysUntil = Math.round(dayDiff);

        setDays(daysUntil);
    }

    const getPlant = async (key) => {

        try {
            await Firebase.database()
                .ref('/plants/' + key)
                .once('value', snapshot => {
                    const data = snapshot.val();
                    setPlant(data);
                });
        } catch (error) {
            console.log("ALERT! Error updating plant info " + error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.container}>

                <View style={styles.plantInfo}>
                    <View style={styles.title}>
                        <View style={styles.plantLine}>
                            {plant.waterAmount == 1 || plant.waterAmount == 2 || plant.waterAmount == 3 ?
                                <View style={styles.plantLine}>
                                    <Entypo name={'drop'} size={20} color='blue' />
                                </View>
                                :
                                <View></View>
                            }
                            {plant.waterAmount == 2 || plant.waterAmount == 3 ?
                                <View style={styles.plantLine}>
                                    <Entypo name={'drop'} size={20} color='blue' />
                                </View>
                                :
                                <View style={styles.plantLine}>
                                    <Entypo name={'drop'} size={20} color='grey' />
                                </View>
                            }
                            {plant.waterAmount == 3 ?
                                <View style={styles.plantLine}>
                                    <Entypo name={'drop'} size={20} color='blue' />
                                </View>
                                :
                                <View style={styles.plantLine}>
                                    <Entypo name={'drop'} size={20} color='grey' />
                                </View>
                            }
                        </View>
                        <View style={styles.plantLine}>
                            <Text style={{ fontSize: 28, fontWeight: 'bold' }}>{plant.name}</Text>
                        </View>
                        <View style={styles.plantLine}>
                            <Tooltip
                                popover={<Text style={styles.tipText} >Days until plant needs water</Text>}
                                backgroundColor='blue'
                            >
                                <View>
                                    {days > 0 ?
                                        <View style={styles.plantLine}>
                                            <Entypo name='calendar' size={30} color='black' />
                                            <Text style={{ fontSize: 28, fontWeight: 'bold' }}> {days}</Text>
                                        </View>
                                        :
                                        <View>
                                            <Text style={{ fontSize: 28, fontWeight: 'bold', color: "red" }}> water today!</Text>
                                        </View>
                                    }
                                </View>
                            </Tooltip>
                        </View>
                    </View>
                    <StatusBar style="auto" />
                </View>

                <View style={styles.waterButton}>
                    <View style={styles.plantLine}>
                        {days <= 0 ?
                            < View style={styles.plantLine}>
                                <Entypo name={'bucket'} size={100} color='blue' onPress={() => waterPlant()} />
                                <Entypo name={'triangle-right'} size={100} color='blue' onPress={() => waterPlant()} />
                            </View>
                            :
                            < View >
                                <Entypo name={'thumbs-up'} size={80} color='orange' />
                            </View>
                        }

                        <Entypo name={plant.icon} size={100} color='green' />
                    </View>
                </View>

                <View style={styles.container}>
                    <Button title={'back'} color={'green'} onPress={() => navigation.navigate('PlantList')} />

                    <Button
                        title="Demo notification"
                        onPress={async () => {
                            await schedulePushNotification(
                                "DEMO " + plant.name + " needs water",
                                2
                            );
                        }}
                    />
                </View>
            </View>
        </View >
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plantInfo: {
        flex: 3,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    waterButton: {
        flex: 2,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    heading: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        fontSize: 20,
        borderWidth: 2,
        borderColor: 'green',
        width: 150,
        height: 40,
        marginBottom: 0,
        paddingLeft: 5,
        borderRadius: 5,
        backgroundColor: 'white'
    },
    inputNumber: {
        fontSize: 20,
        borderWidth: 2,
        borderColor: 'blue',
        width: 35,
        height: 36,
        marginBottom: 0,
        paddingLeft: 5,
        borderRadius: 5,
        backgroundColor: 'white'
    },
    inputView: {
        flex: 0,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        margin: 20
    },
    signIn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    signUpBtn: {
        backgroundColor: 'green',
        borderRadius: 5
    },
    tipText: {
        color: 'white',
    },
    plantLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5
    }
});
