import React from 'react';
import {StackNavigator} from 'react-navigation';
import DealManager from "./DealManager";
import DealCreate from "./DealCreate";
import Ionicons from 'react-native-vector-icons/Ionicons';

export const DealStack = StackNavigator({
    DealManager :
        {
            screen: DealManager,
            navigationOptions:{
                header: null
            }
        },
    DealCreate :
        {
            screen: DealCreate,
            navigationOptions:{
                header: null

            }
        }
});
