import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Firebase, { firebaseAuth } from '../config/Firebase';

export default function HomeScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = () => {
        firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(() => navigation.navigate('BottomNavi'))
            .catch(error => setErrorMsg("Sign in failed " + error));
    }

    useEffect(() => {
        const enter = navigation.addListener('focus', () => {
            setEmail('');
            setPassword('');
        });
        return enter;
    }, [navigation]);

    return (
        <View style={styles.centeredContainer}>


            <View style={styles.textHeader}>

                <Text style={{ fontSize: 42, fontWeight: 'bold', textAlign: 'center' }} >PlantCare</Text>
                <Entypo name='leaf' size={50} color='green' />

            </View>
            <Text style={{ fontSize: 18, color: 'red' }}>{errorMsg}</Text>
            <View style={styles.textInputView}>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                />
                <TextInput
                    secureTextEntry
                    style={styles.input}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={handleLogin}>
                    <View style={styles.loginBtn}>
                        <Text style={styles.loginBtnText}>LOGIN</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.textParagraph}>
                <Text style={{ fontSize: 15, marginBottom: 10 }} onPress={() => navigation.navigate('SignUp')}>Create a new account</Text>
            </View>


            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    centeredContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    image: {
        flex: 1,
        opacity: 0.3
    },
    textHeader: {
        flexDirection: 'row',
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textParagraph: {
        color: "black",
        textAlign: "center",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    textInputView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    input: {
        fontSize: 20,
        borderWidth: 2,
        borderColor: 'green',
        width: 250,
        height: 40,
        marginBottom: 15,
        paddingLeft: 5,
        borderRadius: 5,
        backgroundColor: 'white'
    },
    loginBtn: {
        backgroundColor: 'green',
        borderRadius: 5
    },
    loginBtnText: {
        color: 'white',
        padding: 10,
        fontSize: 20
    }
});