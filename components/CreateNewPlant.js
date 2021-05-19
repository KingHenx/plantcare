import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button, TextInput } from 'react-native';
import { Tooltip } from 'react-native-elements';
import Firebase, { firebaseAuth } from '../config/Firebase';
import { Entypo } from '@expo/vector-icons';

let iconIndex = 0;
let waterIndex = 1;

export default function CreateNewPlant({ navigation }) {

    //initialize states for creating a new stash
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('leaf');
    let iconList = [
        'leaf',
        'flower',
        'feather'
    ];
    const [waterTime, setWaterTime] = useState(3);
    const [waterAmount, setWaterAmount] = useState(1);

    useEffect(() => {
        const enter = navigation.addListener('focus', () => {
            resetFields();
        });
        return enter;
    }, [navigation]);

    const saveAndRedirect = async () => {
        await savePlant();
        resetFields();
        navigation.navigate('PlantList');
    }

    const resetFields = () => {
        setName('');
        setWaterTime(3);
        waterIndex = 1;
        setIcon(iconList[0]);
        iconIndex = 0;
    }

    const savePlant = async () => {

        try {
            let key = getKey();
            console.log(key);

            await Firebase.database().ref('plants/' + key).set(
                {
                    key: key,
                    owner: firebaseAuth.currentUser.uid,
                    name: name,
                    waterTime: parseFloat(waterTime),
                    waterAmount: waterAmount,
                    icon: icon,
                    lastWatering: new Date().toString()
                }
            );

            Alert.alert("new Plant saved");

        } catch (error) {
            console.log("Error saving plant " + error);
        }
    }

    const getKey = () => {
        return Firebase.database().ref('plants/').push().getKey();
    }

    const cycleIcon = () => {

        iconIndex++;

        if (iconIndex > iconList.length - 1)
            iconIndex = 0;

        setIcon(iconList[iconIndex]);
    }

    const changeWaterTime = (amount) => {
        let oldAmount = parseFloat(waterTime);
        let newAmount = oldAmount
        if (oldAmount > 0 && oldAmount !== NaN) {
            if (amount > 0)
                if (oldAmount < 99)
                    newAmount = oldAmount + amount;
                else
                    newAmount = oldAmount;
            else
                newAmount = oldAmount + amount;
        }
        else if (amount > 0) {
            newAmount = amount;
        }
        else {
            newAmount = 0;
        }
        setWaterTime(newAmount);
    }

    const cycleWaterAmount = () => {

        waterIndex++;

        if (waterIndex > 3)
            waterIndex = 1;

        setWaterAmount(waterIndex);
    }


    return (
        <View style={styles.container}>
            <View style={styles.plantForm}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }} >New Plant</Text>

                <View style={styles.inputView}>

                    <View style={styles.plantLine}>

                        <Tooltip
                            popover={<Text style={styles.tipText} >Name or type</Text>}
                            backgroundColor='green'
                        >
                            <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }} >name </Text>
                        </Tooltip>
                        <TextInput
                            style={styles.input}
                            onChangeText={setName}
                            value={name}
                            placeholder='Plant name'
                        />
                    </View>
                    <View style={styles.plantLine}>

                        <Tooltip
                            popover={<Text style={styles.tipText} >How many days between waterings</Text>}
                            backgroundColor='blue'
                        >
                            <Entypo name='calendar' size={40} color='black' />
                        </Tooltip>
                        <Text>        </Text>
                        <Button
                            title="<"
                            onPress={() => changeWaterTime(-1)}
                            color='blue'
                        />
                        <TextInput
                            style={styles.inputNumber}
                            onChangeText={setWaterTime}
                            value={"" + waterTime}
                            keyboardType='number-pad'
                            maxLength={2}
                        />
                        <Button
                            title=">"
                            onPress={() => changeWaterTime(+1)}
                            color='blue'
                        />
                    </View>
                    <View style={styles.plantLine}>

                        <Tooltip
                            popover={<Text style={styles.tipText} >How much water</Text>}
                            backgroundColor='blue'
                        >
                            <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }} >amount </Text>
                        </Tooltip>

                        {waterAmount == 1 || waterAmount == 2 || waterAmount == 3 ?
                            <View style={styles.plantLine}>
                                <Entypo name={'drop'} size={40} color='blue'
                                    onPress={() => cycleWaterAmount()}
                                />
                            </View>
                            :
                            <View></View>
                        }
                        {waterAmount == 2 || waterAmount == 3 ?
                            <View style={styles.plantLine}>
                                <Entypo name={'drop'} size={40} color='blue'
                                    onPress={() => cycleWaterAmount()}
                                />
                            </View>
                            :
                            <View style={styles.plantLine}>
                                <Entypo name={'drop'} size={40} color='grey'
                                    onPress={() => cycleWaterAmount()}
                                />
                            </View>
                        }
                        {waterAmount == 3 ?
                            <View style={styles.plantLine}>
                                <Entypo name={'drop'} size={40} color='blue'
                                    onPress={() => cycleWaterAmount()}
                                />
                            </View>
                            :
                            <View style={styles.plantLine}>
                                <Entypo name={'drop'} size={40} color='grey'
                                    onPress={() => cycleWaterAmount()}
                                />
                            </View>
                        }
                    </View>
                    <View style={styles.plantLine}>
                        <Tooltip
                            popover={<Text style={styles.tipText} >Tap to change Icon</Text>}
                            backgroundColor='green'
                        >
                            <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }} >icon </Text>
                        </Tooltip>
                        <Entypo name={icon} size={45} color='green'
                            onPress={() => cycleIcon()}
                        />
                    </View>
                </View>

            </View>
            <View>
                <Button
                    onPress={saveAndRedirect}
                    title="Save"
                    color='green'
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
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
    plantForm: {
        flex: 0,
        borderWidth: 2,
        borderColor: 'black',
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
