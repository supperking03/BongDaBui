import React from 'react';
import {StackNavigator} from 'react-navigation';
import TeamProfile from "./TeamProfile";
import TeamSetting from "./TeamSetting";
import TeamManager from "./TeamManager";
import GuestProfile from "../GuestProfile";
import SearchTeam from "./SearchTeam";


export const TeamStack = StackNavigator({
    TeamManager :
        {
            screen: TeamManager,
            navigationOptions:{
                header: null

            }
        },
    TeamProfile :
        {
            screen: TeamProfile,
            navigationOptions:{
                header: null
            }
        },
    ProfileSetting :
        {
            screen: TeamSetting,
            navigationOptions:{
                header: null

            }
        },

    Search:
        {
            screen: SearchTeam,
            navigationOptions:{
                header: null

            }
        },
    GuestProfile:
        {
            screen: GuestProfile,
            navigationOptions:{
                header: null

            }
        }


});
