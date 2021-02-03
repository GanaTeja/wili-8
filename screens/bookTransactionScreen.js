import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase'
import db from '../config'
import * as Permissions from 'expo-permissions'
export default class TransactionScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            hasCamerPermissions: null,
            scanned: false,
            scannedBookId: '',
            scannedStudentId: '',
            buttonState: 'normal',
            TransactionMessage: ''
        }
    }
    getcameraPermission = async (id) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({

            hasCamerPermissions: status == "granted",
            buttonState: id,
            scanned: false,
        })
    }
    initiateBookIssue = () => {
        db.collection("transactions").add({
            studentId: this.state.scannedStudentId,
            bookId: this.state.scannedBookId,
            date: firebase.firestore.Timestamp.now().toDate(),
            TransactionType: "issue"
        })
        db.collection("books").doc(this.state.scannedBookId).update({
            bookAvailability: false
        })
        db.collection("students").doc(this.state.scannedStudentId).update({
            numberofbooksissued: firebase.firestore.FieldValue.increment(1)
        })
        this.setState({ sccannedStudentId: '', scannedBookId: '' })
    }
    initiateBookReturn = () => {
        db.collection("transactions").add({
            studentId: this.state.scannedStudentId,
            bookId: this.state.scannedBookId,
            date: firebase.firestore.Timestamp.now().toDate(),
            TransactionType: "return"
        })
        db.collection("books").doc(this.state.scannedBookId).update({
            bookAvailability: true
        })
        db.collection("students").doc(this.state.scannedStudentId).update({
            numberofbooksissued: firebase.firestore.FieldValue.increment(-1)
        })
        this.setState({ sccannedStudentId: '', scannedBookId: '' })
    }
    checkBookEligibility=async()=>{
        var bookRef=await db.collection("books").where("bookId","==",this.state.scannedBookId).get()
        var transactionType=""
        if(bookRef.docs.length==0){transactionType=false}
        else{bookRef.docs.map(doc=>{
            var book = doc.data()
            if(book.bookAvailability){transactionType="issue"}
            else{transactionType="return"}
        })}
        return transactionType
    }
    checkStudentEligibilityForBookIssue=async ()=>{
        var studentRef=await db.collection("students").where("studentId","==",this.state.scannedStudentId).get()
        var isStudentEligible=""
        if(studentRef.docs.length==0){isStudentEligible=false;alert("student does not exist")}
        else{studentRef.docs.map(doc=>{
            var book = doc.data()
            if(book.numberofbooksissued<2){isStudentEligible="true"}
            else{isStudentEligible="false";alert("studet already took two books")}
        })}
        return isStudentEligible
    }
    checkStudentEligibilityForBookReturn=async ()=>{
        var studentRef=await db.collection("transactions").where("bookId","==",this.state.scannedBookId).limit(1).get()
        var isStudentEligible=""
        
        studentRef.docs.map(doc=>{
            var book = doc.data()
            if(book.studentId==this.state.scannedStudentId){isStudentEligible="true"}
            else{isStudentEligible="false";alert("This Book Is Not Issued To This Student")}
        })
        return isStudentEligible
    }
    handleTransaction = async() => {
        var transactionType = await this.checkBookEligibility()
        if (!transactionType) { alert("book is not available in the database") }
        else if (transactionType === "issue") {
            var isStudentEligible = await this.checkStudentEligibilityForBookIssue()
            alert("book Is Issued To The Student")
            if (isStudentEligible) { this.initiateBookIssue() }

        }
        else {
            var isStudentEligible = await this.checkStudentEligibilityForBookReturn()
            alert("book Is Returned By The Student")
            if (isStudentEligible) { this.initiateBookReturn() }
        }
        // var transactionMessage = null;
        // db.collection("books").doc(this.state.scannedBookId).get()
        //     .then((doc) => {

        //         var book = doc.data()
        //         if (book.bookAvailability) {
        //             this.initiateBookIssue()
        //             transactionMessage = "bookIssued"
        //             alert("book is issued")
        //         }
        //         else {
        //             this.initiateBookReturn()
        //             transactionMessage = "BookReturned"
        //             alert("book is returned")
        //             //ToastAndroid.show("book is returned",ToastAndroid.SHORT)
        //         }
        //     })
    }
    handlebarcodescanned = ({ data }) => {
        if (this.state.buttonState == "bookId") {
            this.setState({ scanned: true, scannedBookId: data, buttonState: "normal" })
        }
        else if (this.state.buttonState == "studentId") {
            this.setState({ scanned: true, scannedStudentId: data, buttonState: "normal" })
        }
    }
    render() {
        if (this.state.buttonState !== 'normal' && this.state.hasCamerPermissions) {
            return (<BarCodeScanner style={StyleSheet.absoluteFill}
                onBarCodeScanned={this.state.scanned ? undefined : this.handlebarcodescanned} />)
        }
        else if (this.state.buttonState == 'normal') {


            return (
                <KeyboardAvoidingView behavior="padding">
                    <View style={styles.container}>
                        <Image source={require('../assets/download.jpg')} style={{ width: 100, height: 100 }}>

                        </Image>
                        <View style={styles.inputView}>
                            <TextInput placeholder="BookId" style={styles.inputBox} value={this.state.scannedBookId}
                                onChangeText={(Text) => { this.setState({ scannedBookId: Text }) }}>

                            </TextInput>
                            <TouchableOpacity style={styles.scanButton} onPress={() => { this.getcameraPermission("bookId") }}>

                                <Text style={styles.buttonText}>scan</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputView}>
                            <TextInput placeholder="studentId" style={styles.inputBox} value={this.state.scannedStudentId}
                                onChangeText={(Text) => { this.setState({ scannedStudentId: Text }) }}>

                            </TextInput>
                            <TouchableOpacity style={styles.scanButton} onPress={() => { this.getcameraPermission("studentId") }}>

                                <Text style={styles.buttonText}>scan</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.scanButton} onPress={() => { var transactionMessage = this.handleTransaction() }}>

                            <Text style={styles.buttonText}>submit</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>
            )
        }
    }


};
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    displayText: { fontSize: 15, textDecorationLine: 'underline' },
    scanButton: { backgroundColor: '#2196F3', padding: 10, margin: 10 },
    buttonText: { fontSize: 15, textAlign: 'center', marginTop: 10 }, inputView: { flexDirection: 'row', margin: 20 },
    inputBox: { width: 200, height: 40, borderWidth: 1.5, borderRightWidth: 0, fontSize: 20 },

    scanButton: { backgroundColor: '#66BB6A', width: 50, borderWidth: 1.5, borderLeftWidth: 0 }
});