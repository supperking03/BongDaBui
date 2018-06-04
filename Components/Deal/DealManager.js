import React, {Component} from 'react'
import {Text, View, TouchableOpacity, ListView, Image, StyleSheet, TextInput} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Icon as MatIcon} from 'react-native-elements'
import {height, width} from "react-native-dimension";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


import ModalDropdown from 'react-native-modal-dropdown';
import Feather from "react-native-vector-icons/Feather";
import {ConfirmDialog, Dialog, ProgressDialog} from "react-native-simple-dialogs";
import DealDetailsMiniView from "../Map/DealDetailsMiniView";
import DealDetailDialog from "./DealDetailDialog";
import globalStore from "../../global";
import RelatedDealsListView from "./RelatedDealsListView";
import {RelatedDealRow} from "./RelatedDealRow";
import {CRUCIAL_TEXT_STYLES} from "../../styles/text";
import {BACKGROUND_COLOR} from "../../styles/color";
import {tabNavigatorHeight} from "../../Screen/Home/BottomNavigationTab";

export default class TeamManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: globalStore.getStateOf('Login').loginId,
            myDeal: {
                name: '',
                nameRq: '',
                url:'',
                urlRq:'',
                dealType: '',
                time1: '',
                time2: '',
                date: '',
                state: '',
            },
            followDeal: [],
            isHaveDeal: false,
            dialogVisible: false,
            dealDialog:
                {
                    team:
                        {
                            name: '',
                            url: '',
                        },
                    teamRq:
                        {
                            name: '',
                            url: '',
                        }
                },
            dealDetail: {
                position: '',
                time1 :'',
                time2 :'',
                date :'',
            },
            isLoading : false,
            _this : this,
        };
        globalStore.register('DealManager',
            (s) => this.setState(s),
            () => {
                return this.state
            });
        globalStore.setStateOf('Home',{dealManagerLoaded: true});
    }

    componentWillMount() {
        this.LoadRelatedDeal();
        this.LoadMyDeal();
    }

    LoadRelatedDeal = async () => {
        this.setState({isLoading : true});
        return await fetch('http://71dongkhoi.esy.es/getRelatedDeal.php?id=' + this.state.id)
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson !== 'not found') {
                    console.log(responseJson);
                    this.setState({followDeal: responseJson});
                }
                this.setState({isLoading : false});
            })
            .catch((error) => {
                console.error(error);
            });

    };
    LoadMyDeal = async () => {
        return await fetch('http://71dongkhoi.esy.es/getMyDeal.php?id=' + this.state.id)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(this.state.id);
                console.log(responseJson);
                if (responseJson[0] !== 'n') {
                    this.setState({myDeal: responseJson[0],isHaveDeal :true});
                }
                else
                {
                    this.setState({isHaveDeal :false});
                }
            })
            .catch((error) => {
                console.error(error);
            });

    };

    render() {
        return (
            <View style={{flex: 1, width: '100%',height : height(95) - tabNavigatorHeight ,marginBottom:0,backgroundColor:BACKGROUND_COLOR}}>

                <View style={{width:'100%', aspectRatio:2}}>
                    <View style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 2
                    }}>
                        <Text style={CRUCIAL_TEXT_STYLES.PRIMARY_COLOR}>{"Kèo của bạn : "}</Text>
                    </View>
                    {
                        (this.state.isHaveDeal === true)
                           ? <RelatedDealsListView
                                onDeleteDealPress = {()=>{
                                    this.setState({
                                        isLoading: true,
                                    });
                                    fetch('http://71dongkhoi.esy.es/deleteMyDeal.php', {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            id: globalStore.getStateOf('Login').loginId,
                                        })

                                    }).then((response) => response.json())
                                        .then((responseJson) => {
                                            this.LoadMyDeal();
                                            this.setState({
                                                isLoading: false,
                                            });

// Showing response message coming from server after inserting records.

                                        }).catch((error) => {
                                        console.error(error);

                                    })
                                }}
                                deals={[this.state.myDeal]}
                                onPress={() => {
                                    this.setState({
                                        dialogVisible: true,
                                        dealDialog:
                                            {
                                                team:
                                                    {
                                                        name: this.state.myDeal.name,
                                                        url: this.state.myDeal.url,
                                                    },
                                                teamRq:
                                                    {
                                                        name: (this.state.myDeal.state === '0')?'N/A':this.state.myDeal.nameRq,
                                                        url: (this.state.myDeal.state === '0')
                                                            ?'https://vignette.wikia.nocookie.net/joke-battles/images/5/5a/Black.jpg/revision/latest/scale-to-width-down/400?cb=20161223050425'
                                                            :this.state.myDeal.urlRq
                                                    }
                                            },
                                        dealDetail:
                                            {
                                                position : this.state.myDeal.position,
                                                time1 : this.state.myDeal.time1,
                                                time2: this.state.myDeal.time2,
                                                date : this.state.myDeal.date,
                                                pitch : this.state.myDeal.pitch,
                                            }
                                    });}}
                            />
                           : <View style={{
                                width: '100%',
                                height: height(15),
                                flexDirection: 'row',
                                borderTopWidth: 1,
                                borderColor: '#bdc3c7',
                                marginLeft: 20
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('DealCreate', {
                                            AdminId: globalStore.getStateOf('Login').loginId,
                                        });
                                    }}
                                    style={{flexDirection: 'row', alignItems: 'center'}}
                                >
                                    <Ionicons name="ios-add-circle-outline" size={height(7)} color="#4CAF50"/>
                                    <Text style={{fontSize: height(3), color: "#4CAF50", marginLeft: 5}}>Tạo kèo</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
                <View style={{flex : 1}}>
                    <View style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        paddingLeft: '2%',
                        paddingRight: '2%',
                        paddingTop: '0.5%',
                        marginBottom:'0.5%',
                        marginTop:'6%',
                    }}>
                        <Text style={CRUCIAL_TEXT_STYLES.PRIMARY_COLOR}>{"Các kèo khác : "}</Text>
                    </View>
                    <RelatedDealsListView
                        deals={this.state.followDeal}
                        onPress={(deal) => {
                            this.setState({
                                dialogVisible: true,
                                dealDialog:
                                    {
                                        team:
                                            {
                                                name: deal.name,
                                                url: deal.url,
                                            },
                                        teamRq:
                                            {
                                                name: deal.nameRq,
                                                url: deal.urlRq
                                            }
                                    },
                                dealDetail:
                                    {
                                        position : deal.position,
                                        time1 : deal.time1,
                                        time2: deal.time2,
                                        date : deal.date,
                                        pitch: deal.pitch,
                                    }
                            });}}
                    />
                </View>
                <Dialog
                    visible={this.state.dialogVisible}
                    dialogStyle={{height: height(60)}}
                    contentStyle={{padding: 0, paddingTop: 0}}
                    onTouchOutside={() => this.setState({dialogVisible: false})}
                >
                    <View style={{height: height(40)}}>
                        <DealDetailDialog
                            team={this.state.dealDialog.team}
                            teamRq={this.state.dealDialog.teamRq}
                            dealDetail={this.state.dealDetail}/>
                    </View>
                </Dialog>
                <ProgressDialog
                    visible={this.state.isLoading}
                    message="Đang cập nhật..."
                />

            </View>
        )
    }

}


const styles = StyleSheet.create({
    modal: {
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        height: 30,
        width: width(33),
    },

    modalbtnText: {},
    dropdownstyle: {
        width: width(30),
        backgroundColor: 'white',
        alignSelf: 'flex-end'
    }
});


