import React from 'react';
import {StackNavigator} from 'react-navigation';
import TeamProfile from "../Team/TeamProfile";
import Map from "./MapDeal";
import GuestProfile from "../GuestProfile";


export const MapStack = StackNavigator({
    Map :
        {
            screen: Map,
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
    GuestProfile:
        {
            screen: GuestProfile,
            navigationOptions:{
                header: null

            }
        }


});
