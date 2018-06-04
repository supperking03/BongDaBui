import React, {Component} from 'react'
import {
    Text, View, TouchableOpacity, Image, ImageBackground, StyleSheet, ScrollView, Alert,
    ListView, Modal
} from 'react-native'
import {Icon as ElementIcon, SocialIcon} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import call from "react-native-phone-call";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {height, width} from "react-native-dimension";
import globalStore from "../../global";
import {ProgressDialog} from "react-native-simple-dialogs";
import Share from "react-native-share";

var shareOptions = {
    title: "FIFA onLife",
    message: "Join with us ",
    url: "https://www.facebook.com/phanmemtienichsinhvien",
    subject: "Share Link", //  for email
    social: "facebook",
};

var shareOptions1 = {
    title: "FIFA onLife",
    message: "Join with us ",
    url: "https://www.facebook.com/phanmemtienichsinhvien",
    subject: "Share Link", //  for email
    social: "twitter",
};


export default class ProfileView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            modalVisibleDeal: false,
            numberDeal: 0,
            dataSourceDeal: [],
            isLoading: true,
            _this: this,
        }
        globalStore.register('Profile',
            (s) => this.setState(s),
            () => {
                return this.state
            });

        this.LoadDealReq();

    }


    _navigateBackPressed() {

    }

    _settingProfilePressed() {
        this.props.navigation.navigate('ProfileSetting');
    }


    _followPressed() {
    }

    _callPressed(number) {
        call({number: number, prompt: false}).catch(console.error)
    }

    showListDealRequestPressed() {
        this.setState({modalVisibleDeal: true});

        if (this.state.numberDeal === 0) {
            this.setState({dataSourceDeal: []});
            return;
        }

        fetch('http://71dongkhoi.esy.es/getDealRequest.php?id=' + globalStore.getStateOf('Login').loginId)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("req List");
                console.log(responseJson);
                if (responseJson === "not found") {
                    this.setState({
                        dataSourceDeal: [],
                        numberDeal: 0
                    });
                    return;
                }
                this.setState({
                    dataSourceDeal: responseJson
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    hideListDealRequestPressed() {
        this.setState({modalVisibleDeal: false});
    }

    acceptDealRequest = (user) => {
        this.setState({modalVisibleDeal: true});

        if (this.state.numberDeal === 0) {
            this.setState({dataSourceDeal: []});
            return;
        }
        fetch('http://71dongkhoi.esy.es/acceptDealRequest.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.userId,
                id: this.state.user.id,

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                });
                this.showListDealRequestPressed();


// Showing response message coming from server after inserting records.

            }).catch((error) => {
            console.error(error);

        });
    }

    denyDealRequest = (user) => {
        if (this.state.numberDeal === 1) {
            this.setState({dataSourceDeal: [], numberDeal: 0});
            // this.setState({
            //     modalVisibleTeam:false
            // })
        }
        console.log("User");
        console.log(user.id);
        console.log("Me");
        console.log(this.state.user.id);
        fetch('http://71dongkhoi.esy.es/deleteDealRequest.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.userId,
                id: this.state.user.id,

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                });


// Showing response message coming from server after inserting records.
                this.showListDealRequestPressed();

            }).catch((error) => {
            console.error(error);

        })
    }

    renderRowDeal(user) {
        return (
            <TouchableOpacity style={profileStyles.TouchableRequestItems}>

                <Image style={{width: 70, height: 70, borderRadius: 50}}
                       source={{uri: user.url}}/>
                <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 18}}>{user.name}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 30,}}>
                            <TouchableOpacity
                                onPress = {()=>{
                                    this.hideListDealRequestPressed();
                                    this.props.navigation.navigate('TeamProfile',{
                                        Id : user.adminId});
                                }}
                                style={profileStyles.TouchableItemViewProfile}>
                                <Text style={{fontWeight: 'bold', color: '#16a085'}}>View profile</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <TouchableOpacity style={{justifyContent: 'center'}}
                                      onPress={() => {
                                          this.acceptDealRequest(user)
                                      }}>
                        <Icon size={30} name="md-checkmark-circle" color="#27ae60"/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{justifyContent: 'center', marginLeft: 10, marginRight: 5}}
                                      onPress={() => {
                                              this.denyDealRequest(user)
                                      }}>
                        <Icon size={30} name="md-remove-circle" color="#e74c3c"/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

        )
    }

    LoadDealReq = () => {
        this.setState({isLoading : true});
        return fetch('http://71dongkhoi.esy.es/getDealRequest.php?id=' + globalStore.getStateOf('Login').loginId)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    numberDeal: responseJson.length,
                });
                if (responseJson === "not found") {
                    this.setState({
                        dataSourceDeal: [],
                        numberDeal: 0});
                    this.setState({isLoading: false});
                    return;
                }
                this.setState({isLoading: false});
            })
            .catch((error) => {
                this.setState({isLoading: false});
            })
    }

    render() {
        return (
            <View style={{flex: 1, marginBottom: 0}}>
                <View>

                    <View style={profileStyles.navigateBar}>
                        <View/>

                        <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={this._settingProfilePressed.bind(this)}>
                            <Text style={{fontSize: 15, fontWeight:'bold', color:'white'}}> Cài đặt </Text>
                            <ElementIcon name="settings" color="white"/>
                        </TouchableOpacity>
                    </View>

                    <View style={profileStyles.header}>
                        <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: '#27ae60'}}>
                            <View style={profileStyles.headerSubContent}>
                                <Text style={profileStyles.name}>{this.state.user.name}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, justifyContent: 'flex-start'}}>
                            <View style={{
                                marginLeft: width(70) - 40,
                                marginBottom: 20,
                                marginTop: 20,
                                flexDirection: 'row'
                            }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>

                                    <TouchableOpacity onPress={() => {
                                        Share.shareSingle(shareOptions);
                                    }}>
                                        <SocialIcon iconSize={20} style={{width: 30, height: 30, marginRight: 3}}
                                                    type='facebook'/>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        Share.shareSingle(shareOptions1);
                                    }}>
                                        <SocialIcon iconSize={20} style={{width: 30, height: 30, marginRight: 10}}
                                                    type='twitter'/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flexDirection: 'column', marginTop: '6%', alignItems:'center', justifyContent:'center'}}>
                                    <TouchableOpacity style={{flexDirection: 'row', width: 40, alignItems: 'center'}}
                                                      onPress={this.showListDealRequestPressed.bind(this)}>
                                        <FontAwesome size={30} name='globe' color={'#27ae60'}/>
                                        {
                                            this.state.numberDeal === 0 ? <View/> :
                                                <View style={{
                                                    backgroundColor: 'red',
                                                    width: 18,
                                                    height: 18,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 5,
                                                    marginLeft: -8
                                                }}>

                                                    <Text
                                                        style={{color: 'white'}}>{this.state.numberDeal}</Text>

                                                </View>
                                        }
                                    </TouchableOpacity>
                                    <Text style={{fontWeight: 'bold', fontSize: 12, color:'#27ae60'}}>Kèo</Text>
                                </View>
                            </View>
                        </View>
                        <Image style={profileStyles.avatar} source={{uri: this.state.user.url}}/>
                    </View>

                </View>
                <View style={{flex: 1, backgroundColor: 'white'}}>

                    <View style={profileStyles.infoView}>
                        <Icon name="md-call" size={30} color="#16a085"/>
                        <View style={{borderBottomWidth: 1, borderColor: '#ecf0f1', padding: 10, flex: 1}}>
                            <Text style={profileStyles.infoText}>{this.state.user.phone}</Text>
                        </View>
                    </View>

                    <View style={profileStyles.infoView}>
                        <Icon name="md-mail" size={30} color="#16a085"/>
                        <View style={{borderBottomWidth: 1, borderColor: '#ecf0f1', padding: 10, flex: 1}}>
                            <Text style={profileStyles.infoText}>{this.state.user.email}</Text>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        //alignItems: 'center',
                        marginLeft: 20,
                        marginRight: 20,
                        flex: 1
                    }}>
                        <View style={{justifyContent: 'flex-start', marginTop: 10}}>
                            <Icon name="md-clipboard" size={30} color="#16a085"/>
                        </View>
                        <View style={{borderBottomWidth: 1, borderColor: '#ecf0f1', padding: 10, flex: 1}}>
                            <ScrollView style={{flex: 1}}>
                                <Text style={profileStyles.infoText}>{this.state.user.about}</Text>
                            </ScrollView>


                        </View>
                    </View>


                </View>

                <Modal animationType="slide" transparent={false} visible={this.state.modalVisibleDeal}
                       onRequestClose={() => {
                       }}>
                    <View style={{marginTop: 22, justifyContent: 'center'}}>
                        <View style={{borderBottomWidth: 1, borderColor: '#bdc3c7', marginBottom: 3}}>
                            <TouchableOpacity
                                style={{alignSelf: 'center'}}
                                onPress={this.hideListDealRequestPressed.bind(this)}>
                                <Icon size={35} name="ios-arrow-down-outline" color="grey"/>
                            </TouchableOpacity>
                        </View>

                        <ListView
                            dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.dataSourceDeal)}
                            renderRow={this.renderRowDeal.bind(this)}/>

                    </View>
                </Modal>
                <ProgressDialog
                    visible={this.state.isLoading}
                    message="Đang cập nhật..."
                />

            </View>
        );
    }
    ;


}

const profileStyles = StyleSheet.create(
    {
        navigateBar: {
            flexDirection: 'row',
            width: '100%',
            height: 50,
            justifyContent: 'space-between',
            backgroundColor: '#27ae60',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20
        },
        header: {
            width: '100%', height: 200, justifyContent: 'center'
        },
        headerSubContent: {
            marginLeft: 140,
            flexDirection: 'row',
            alignContent: 'center',
            marginBottom: 8,
            marginTop: 8,
            justifyContent: 'center'
        },
        avatar: {
            marginLeft: 20,
            width: 120,
            height: 120,
            borderRadius: 100,
            position: 'absolute',
            borderWidth: 3,
            borderColor: 'white'
        },
        name: {
            fontWeight: 'bold', fontSize: 20, color: 'white', marginLeft: 5
        },
        callButton: {
            backgroundColor: '#27ae60',
            width: 100,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
        },
        followButton: {
            backgroundColor: 'white',
            width: 100,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#27ae60'
        },
        infoView: {
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
        },
        infoText: {
            marginLeft: 10,
            color: '#34495e',
            fontSize: 20,
        },
        TouchableRequestItems: {
            width: '100%',
            height: 100,
            flexDirection: 'row',
            padding: 20,
            borderBottomWidth: 2,
            borderColor: '#bdc3c7'
        },

        TouchableItemViewProfile: {
            borderRadius: 50,
            borderWidth: 2,
            borderColor: '#16a085',
            margin: 3,
            padding: 2,
            width: 150,
            alignItems: 'center',
            justifyContent: 'center'
        },


    }
);