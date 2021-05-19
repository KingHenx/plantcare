import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Firebase, { firebaseAuth } from '../config/Firebase';

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        await firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(newUser => {
                Firebase.database().ref('users').child(newUser.user.uid).set({
                    username: username
                })
            })
            .catch(error => console.log(error));
    }

    return (
        <View style={styles.container}>

            <View style={styles.heading}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Create a new account</Text>
            </View>

            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={async () => {
                    await handleSignUp();
                    navigation.navigate('Home');
                }}>
                    <View style={styles.signUpBtn}>
                        <Text style={styles.signUpBtnText}>Create account</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.signIn}>
                <Text style={{ fontSize: 15, marginBottom: 10 }} onPress={() => navigation.navigate('Home')}>Already have an account? Sign in!</Text>
            </View>

            <StatusBar style="auto" />
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
        width: 250,
        height: 40,
        marginBottom: 15,
        paddingLeft: 5,
        borderRadius: 5,
        backgroundColor: 'white'
    },
    inputView: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'flex-start'
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
    signUpBtnText: {
        color: 'white',
        padding: 10,
        fontSize: 20
    }
});
