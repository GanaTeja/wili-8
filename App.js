import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import  {createBottomTabNavigator } from 'react-navigation-tabs'  
import TransactionScreen from './screens/bookTransactionScreen'
import LoginScreen from './screens/loginScreen';
import SearchScreen from './screens/searchScreen'
export default class App extends React.Component {
    render(){
        return(
    <AppContainer/>        
        )
    }
};
const TabNavigator = createBottomTabNavigator({
transaction:{screen:TransactionScreen},
search:{screen:SearchScreen},
},{
    defaultNavigationOptions:({navigation})=>{return({
        tabBarIcon:()=>{
            const rootName = navigation.state.routeName
            if(rootName=="transaction")
            {return(
                <Image source= {require('./assets/book.png')} style ={{width:40,height:40}} ></Image>
            )}
            else if(rootName=="search"){return(
                <Image source= {require('./assets/searchingbook.png')} style ={{width:40,height:40}} ></Image>
            )}
        }
    })}
})
const AppNavigator=createSwitchNavigator({
    loginScreen:LoginScreen,
    transaction:TabNavigator,

})
const AppContainer=createAppContainer(AppNavigator)