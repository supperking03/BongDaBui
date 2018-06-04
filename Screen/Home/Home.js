import React, {Component} from 'react';
import {NavigationComponent} from 'react-native-material-bottom-navigation'
import {BottomNavigation} from './BottomNavigationTab'
import globalStore from "../../global";
import {View} from "react-native";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                loginId: globalStore.getStateOf('Login').loginId,
                _this: this,
                userLoaded: false,
                teamLoaded: false,
                dealManagerLoaded: false,
                mapLoaded: false,
                teamprofileLoaded: false,
            }


        globalStore.register('Home',
            (s) => this.setState(s),
            () => {
                return this.state
            });

        globalStore.setStateOf('Login', {homeLoaded: true});

    }

    componentWillMount() {
        this.LoadData();
        console.log("Loaded")

    }

    LoadData = async () => {
        return await fetch('http://71dongkhoi.esy.es/getDeal.php')
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson !== 'not found') {
                    globalStore.setStateOf('List', {dataSource: responseJson, filterData: responseJson});
                    if (this.state.mapLoaded === true)
                        globalStore.setStateOf('Map', {deals: responseJson, dealFilter: responseJson});
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        return (
            <View style={{flex : 1}}>
                <BottomNavigation
                    This={this}/>
            </View>
        )
    }
}
