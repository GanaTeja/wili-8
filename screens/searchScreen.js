import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, FlatList, ScrollView, TextInput } from 'react-native';
import db from '../config'
export default class SearchScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            allTransactions: [],
            lastTransacction: '',
            search: ''
        }
    }
    getTransactionDetails = () => {
        var allTransactions = []
        db.collection("transactions").limit(10).get()
            .then(response => {
                response.docs.map(doc => {
                    var document = doc.data();
                    allTransactions.push(document);
                    this.setState({
                        allTransactions: allTransactions,
                        lastTransaction: doc
                    })
                })
            })
    }
    searchTransaction = async (text) => {
        var enteredText = text.split("")
        var text = text.toUpperCase()
        try {
            if (enteredText[0].toUpperCase() === 'B') {
                const transaction = await db.collection("transactions").where("bookId", "==", text)
                    .get()
                transaction.docs.map(doc => {
                    this.setState({
                        allTransactions: [...this.state.allTransactions, doc.data()],
                        lastTransacction: doc

                    })
                })

            }
            else if (enteredText[0].toUpperCase() === 'S') {
                const transaction = await db.collection("transactions").where("studentId", "==", text)
                    .get()
                transaction.docs.map(doc => {
                    this.setState({
                        allTransactions: [...this.state.allTransactions, doc.data()],
                        lastTransacction: doc

                    })
                })

            }
        }
        catch (error) { alert("cant Search empty fields") }
    }
    componentDidMount() { this.getTransactionDetails() }
    render() {
        return (
            <ScrollView>
                <TextInput style={styles.bar} placeholder="enter book id or student id"
                    onChangeText={text => {
                        this.setState({ allTransactions: [], search: text })
                    }} />
                <TouchableOpacity onPress={() => { this.searchTransaction(this.state.search) }}>
                    <Text>search</Text></TouchableOpacity>
                    <FlatList
                      data = {this.state.allTransactions}
                      renderItem={({item})=>{
                          return(<View>
                              <Text>{"bookId"+item.bookId}</Text>
                              <Text>{"studentId"+item.studentId}</Text>
                              <Text>{" transaction Type "+item.TransactionType}</Text>
                              <Text>{"date: "+item.date}</Text>
                          </View>)
                      }}
                      keyExtractor={(item,index)=>{index.toString()}}
                    />
            </ScrollView>
        )
    }

};
const styles = StyleSheet.create({ container: { flex: 1, marginTop: 20, flexDirection: "row", }, searchBar: { flexDirection: "row", height: 40, width: "auto", borderWidth: 0.5, alignItems: "center", backgroundColor: "grey", }, bar: { borderWidth: 2, height: 30, width: 300, paddingLeft: 10, }, searchButton: { borderWidth: 1, height: 30, width: 50, alignItems: "center", justifyContent: "center", backgroundColor: "green", }, });
