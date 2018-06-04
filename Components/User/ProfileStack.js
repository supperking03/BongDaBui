import React from 'react';
import {StackNavigator} from 'react-navigation';
import ProfileView from "./ProfileView";
import ProfileSetting from "./ProfileSetting";
import PhoneAuth from "./PhoneAuth";
import TeamProfile from "../Team/TeamProfile";
import GuestProfile from "../GuestProfile";

export const ProfileStack = StackNavigator({
   Profile :
       {
           screen: ProfileView,
           navigationOptions:{
               header: null
           }
       },
    ProfileSetting :
        {
            screen: ProfileSetting,
            navigationOptions:{
                header: null

            }
        },
    PhoneAuth :
        {
            screen: PhoneAuth,
            navigationOptions:{
                header: null
            }
        },
    TeamProfile :
        {
            screen : TeamProfile,
            navigationOptions:{
                header : null,
            }
        },
    GuestProfile :
        {
            screen : GuestProfile,
            navigationOptions:
                {
                    header : null,
                }
        }
});
