import React from 'react';
import {StackNavigator} from 'react-navigation';
import Login from './Screen/Login/Login';
import Home from "./Screen/Home/Home";
import ProfileSetting from "./Components/User/ProfileSetting";
import PhoneAuth from "./Components/User/PhoneAuth";

export const HomeStack = StackNavigator({
    ManHinh_Login:{
        screen: Login,
        navigationOptions:{
            header: null

        }
    },
    ManHinh_Manager:{
        screen: Home,
        navigationOptions:{
            header: null

        }
    },
    ManHinh_Create:{
        screen: ProfileSetting,
        navigationOptions:{
            header: null

        }
    },
    PhoneAuth:{
        screen: PhoneAuth,
        navigationOptions:{
            header: null

        }
    },
});