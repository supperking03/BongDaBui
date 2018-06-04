import React, {Component} from 'react';
import globalStore from "../../../global";
import Feather from "react-native-vector-icons/Feather";
import {ProfileStack} from "../../../Components/User/ProfileStack";

export default class User extends Component {


    constructor(props) {
        super(props);
        this.state =
            {
                loginId: globalStore.getStateOf('Login').loginId,
                userInfo :{},
                _this : this,
            }


        globalStore.register('User',
            (s) => this.setState(s),
            () => {
                return this.state
            });
        globalStore.setStateOf('Home',{userLoaded: true});
        this.LoadUserInfo();
    }

    LoadUserInfo = () => {
        return fetch('http://71dongkhoi.esy.es/getUser.php?id=' + this.state.loginId)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson[0].name);
                this.setState({userInfo: responseJson[0]});
                globalStore.setStateOf('Profile',{user : responseJson[0]})
            })
            .catch((error) => {
                console.error(error);
            });

    }


    render() {
        return (
            <ProfileStack/>
        )
    }
}
