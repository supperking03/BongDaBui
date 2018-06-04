import React from 'react';
import {StackNavigator} from 'react-navigation';
import TeamProfile from "../Team/TeamProfile";
import GuestProfile from "../GuestProfile";
import ListDeal from "./ListDeal";


export const ListDealStack = StackNavigator({
    List :
        {
            screen: ListDeal,
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
