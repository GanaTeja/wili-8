import _default from 'expo/build/DangerZone'
import React from 'react'
import firebase from 'firebase'
import { Component } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
export default class LoginScreen extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',

        }
    }
    login = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
                .then((response) => { this.props.navigation.navigate("transaction") })
        }
        catch (error) {
            alert("please enter valid email and password")
        }
    }
    render() {
        return (
            <View style = {{alignItems:'center',marginTop:20,flex:1,backgroundColor:"lightblue"}}
            >
                <TextInput placeholder="enter email id" onChangeText={(text) => { this.setState({ email: text }) }}
                    style={styles.loginBox}
                >

                </TextInput>
                <TextInput placeholder="enter password" onChangeText={(text) => { this.setState({ password: text }) }}
                secureTextEntry={true}
                    styles={styles.loginBox}
>

                </TextInput>
                <TouchableOpacity style={{
                    height: 30, width: 90, borderWidth: 1,
                    marginTop: 20, paddingTop: 5, borderRadius: 7
                }}

                    onPress={() => { this.login(this.state.email, this.state.password) }}><Text>
                        login
                    </Text></TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    loginBox: {
        width: 300, height: 40, borderWidth: 1.5,
        fontSize: 20, margin: 10, paddingLeft: 10
    }
})