import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, ImageBackground} from "react-native"
import {height, width} from "react-native-dimension";
import SplashScreen from "./SplashScreen";
import globalStore from "../../global";


var {FBLogin, FBLoginManager} = require('react-native-facebook-login');

export default class Login extends Component {
    getUser = (data) => {
        return fetch('http://71dongkhoi.esy.es/getUser.php')
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson[0].name);
                this.setState({
                    name: responseJson[0].name,
                    phone: responseJson[0].phone,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    constructor(props) {
        super(props);
        this.state = {
            loginId: "",
            name: "",
            url: "https://facebook.github.io/react-native/docs/assets/favicon.png",
            phone: "",
            email: "",
            about: "",
            homeLoaded: false,
        };
        globalStore.register('Login',
            (s) => this.setState(s),
            () => {
                return this.state
            });

    }


    render() {
        var _this = this;
        return (
            <View style={{flex: 1, backgroundColor:'#36c6c4'}}>
                <View style={{flex: 2}}>
                    <SplashScreen style={{width: '100%', height: '50%'}}>
                    </SplashScreen>
                </View>

                <View style={{
                    flex: 0.3,
                    alignSelf:'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'transparent'
                }}>
                    <FBLogin style={{ borderRadius:10, width: "100%",height: "100%"}}
                             ref={(fbLogin) => {
                                 this.fbLogin = fbLogin
                             }}
                             permissions={["email", "user_friends"]}
                             loginBehavior={FBLoginManager.LoginBehaviors.Native}
                             onLogin={function (data) {
                                 return fetch('http://71dongkhoi.esy.es/getUser.php?id=' + data.credentials.userId)
                                     .then((response) => response.json())
                                     .then((responseJson) => {
                                         _this.setState({ loginId : data.credentials.userId });
                                         _this.setState({
                                             url: data.profile.picture.data.url,
                                             name: data.profile.name
                                         });
                                         var isFirstTime = false;
                                         //name
                                         if (_this.state.name != responseJson[0].name) {
                                             _this.setState({
                                                 name: responseJson[0].name,
                                                 phone: responseJson[0].phone,
                                                 email: responseJson[0].email,
                                                 about: responseJson[0].about,
                                             });
                                         }
                                         else {
                                             _this.setState({
                                                 phone: responseJson[0].phone,
                                                 email: responseJson[0].email,
                                                 about: responseJson[0].about,
                                             });
                                         }
                                         // url
                                         if (_this.state.url != responseJson[0].url) {
                                             _this.setState({
                                                 url: responseJson[0].url
                                             });
                                         }

                                         if (responseJson[0].url === undefined) {
                                             _this.setState({
                                                 url: "http://graph.facebook.com/" + data.credentials.userId + "/picture?type=large",
                                             });
                                         }

                                         if (responseJson[0].name === undefined) {
                                             _this.setState({
                                                 name: data.profile.name,
                                             });
                                             isFirstTime = true;
                                         }
                                         if(isFirstTime === false)
                                            _this.props.navigation.navigate('ManHinh_Manager');
                                         else
                                             _this.props.navigation.navigate('ManHinh_Create');
                                     })


                                 // _this.props.navigation.navigate('ManHinh_User',{Url : _this.state.url, Name: _this.state.name, Id: data.credentials.userId });

                             }}
                             onLogout={function () {
                                 console.log("Logged out.");
                                 _this.setState({user: {},homeLoaded : false});
                                 _this.setState({
                                     url: "https://facebook.github.io/react-native/docs/assets/favicon.png",
                                     name: "user"
                                 })
                             }}
                             onLoginFound={function (data) {
                                 console.log("Existing login found.");
                                 console.log(data);
                                 return fetch('http://71dongkhoi.esy.es/getUser.php?id=' + data.credentials.userId)
                                     .then((response) => response.json())
                                     .then((responseJson) => {
                                         console.log(responseJson[0]);
                                         _this.setState({ loginId : data.credentials.userId });
                                         var isFirstTime = false;
                                         //name
                                         if ('' !== responseJson[0].name) {
                                             _this.setState({
                                                 name: responseJson[0].name,
                                                 phone: responseJson[0].phone,
                                                 email: responseJson[0].email,
                                                 about: responseJson[0].about,
                                             });
                                         }
                                         // url
                                         if (undefined !== responseJson[0].url) {
                                             _this.setState({
                                                 url: responseJson[0].url
                                             });
                                         }

                                         if (responseJson[0].url === undefined) {
                                             _this.setState({
                                                 url: "http://graph.facebook.com/" + data.credentials.userId + "/picture?type=large",
                                             });
                                         }

                                         if (responseJson[0].name === undefined) {
                                             _this.setState({
                                                 name: '',
                                             });
                                             isFirstTime = true;
                                         }
                                         if(isFirstTime === false)
                                             _this.props.navigation.navigate('ManHinh_Manager');
                                         else
                                             _this.props.navigation.navigate('ManHinh_Create');
                                     })
                                     .catch((error) => {
                                         console.error(error);
                                     });


                                 //_this.setState({ user : data.credentials });
                             }}
                             onLoginNotFound={function () {
                                 console.log("No user logged in.");
                                 _this.setState({user: null});
                             }}
                             onError={function (data) {
                                 console.log("ERROR");
                                 console.log(data);
                             }}
                             onCancel={function () {
                                 console.log("User cancelled.");
                             }}
                             onPermissionsMissing={function (data) {
                                 console.log("Check permissions!");
                                 console.log(data);
                             }}
                    />
                </View>
                <View style={{flex:0.5}}>

                </View>
            </View>
        );
    }

};