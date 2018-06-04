import React from 'react'
import TeamManager from "../../Components/Team/TeamManager";
import ProfileView from "../../Components/User/ProfileView";
import DealListView from "../../Components/List/ListDeal";
import DealManager from "../../Components/Deal/DealManager";
import {NavigationComponent} from "react-native-material-bottom-navigation/index";
import {TabNavigator} from "react-navigation";
import User from "./Tabs/User";
import Team from "./Tabs/Team";
import globalStore from "../../global";
import Deal from "./Tabs/Deal";
import Map from "./Tabs/Map";
import List from "./Tabs/List";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Icon} from "react-native-elements";

export const tabNavigatorHeight = 50;


export const BottomNavigation = TabNavigator(
    {
        DealListView: {screen: List},
        DealMapView: {screen: Map},
        DealManager: {screen: Deal},
        TeamManager: {screen: Team},
        Profile: {screen: User}
    },
    {
        tabBarComponent: NavigationComponent,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            bottomNavigationOptions: {
                innerStyle: {
                    elevation: 10,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    borderWidth: 0.2,
                    borderColor: "#95a5a6",
                    height: tabNavigatorHeight
                },
                labelColor: '#2c3e50',
                activeLabelColor: '#27ae60',
                backgroundColor: 'white',
                rippleColor: 'black',
                shifting: false,
                tabs: {
                    DealListView: {
                        label: "Trang chủ",
                        icon: (<Icon size={24} name="home" color="#2c3e50"/>),
                        activeIcon: (<Icon size={24} name="home" color="#27ae60"/>)
                    },
                    DealMapView: {
                        label: "Bản đồ",
                        icon: (<Icon size={24} name="map" color="#2c3e50"/>),
                        activeIcon: (<Icon size={24} name="map" color="#27ae60"/>)
                    },
                    DealManager: {
                        label: "Kèo",
                        icon: (<Ionicons size={24} name="ios-football" color="#2c3e50"/>),
                        activeIcon: (<Ionicons size={24} name="ios-football" color="#27ae60"/>)
                    },
                    TeamManager: {
                        label: "Đội bóng",
                        icon: (<MaterialCommunityIcons size={24} name="account-group" color="#2c3e50"/>),
                        activeIcon: (<MaterialCommunityIcons size={24} name="account-group" color="#27ae60"/>)
                    },
                    Profile:
                        {
                            label: 'Cá nhân',
                            icon : (<Feather size={24} name="settings" color="#2c3e50"/>),
                            activeIcon : (<Feather size={24} name="settings" color="#27ae60"/>),
                        }
                }
            },
        },
        navigationOptions: ({navigation}) => ({
            tabBarOnPress: (scene, jumpToIndex) => {
                switch (scene.index) {
                    case 0 :case 1:
                        globalStore.getStateOf('Home')._this.LoadData();break;
                    case 2 : {
                        if (globalStore.getStateOf('Home').dealManagerLoaded === true) {
                            globalStore.getStateOf('DealManager')._this.LoadMyDeal();
                            globalStore.getStateOf('DealManager')._this.LoadRelatedDeal();
                        }
                    }
                        break;
                    case 3 : {
                        if (globalStore.getStateOf('Home').teamLoaded === true) {
                            globalStore.getStateOf('TeamManager')._this.LoadData();

                        }
                        if (globalStore.getStateOf('Home').teamprofileLoaded === true)
                        {
                            globalStore.getStateOf('TeamProfile')._this.LoadTeamReq();
                        }
                    }
                    break;
                    case 4 : {
                        if (globalStore.getStateOf('Home').userLoaded === true) {
                            globalStore.getStateOf('User')._this.LoadUserInfo();
                            globalStore.getStateOf('Profile')._this.LoadDealReq();
                        }
                    }
                    break;
                }
                jumpToIndex(scene.index);
            },
        }),

    }
);