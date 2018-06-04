import React, {Component} from 'react'
import {
    Text, View, TouchableOpacity, Image, ImageBackground, StyleSheet, ScrollView, ListView,
    Alert, Modal
} from 'react-native'
import {Icon as ElementIcon} from 'react-native-elements'

import call from "react-native-phone-call";
import globalStore from "../../global";
import {width} from "react-native-dimension";
import Share from "react-native-share";
import SocialIcon from "react-native-elements/src/social/SocialIcon";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from 'react-native-vector-icons/Ionicons'
import {ICON_COLOR, ICON_SIZE} from "../../styles/icon";


var shareOptions = {
    title: "Bóng đá bụi",
    message: "Chơi bóng ngay, cáp kèo liền tay ",
    url: "https://play.google.com/store/apps/details?id=com.reackathon",
    subject: "Share Link", //  for email
    social: "facebook",
};

var shareOptions1 = {
    title: "Bóng đá bụi",
    message: "Chơi bóng ngay, cáp kèo liền tay ",
    url: "https://play.google.com/store/apps/details?id=com.reackathon",
    subject: "Share Link", //  for email
    social: "twitter",
};


export default class TeamProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.navigation.state.params.Id,
            loginId: globalStore.getStateOf('Login').loginId,
            team: {},
            members: [],
            follow: false,
            _this: this,
            dataSourceTeam: [],
            numberTeam: 0,
            modalVisibleTeam: false,
            voted: true,
            numberOfVote: 0,
        };
        globalStore.register('TeamProfile',
            (s) => this.setState(s),
            () => {
                return this.state
            });

        globalStore.setStateOf('Home', {teamprofileLoaded: true});
        this.LoadTeamInfo();
        this.LoadTeamUser();
        this.LoadTeamReq();
        this.checkVote();
        this.getVote();
    }

    getVote() {
        return fetch('http://71dongkhoi.esy.es/getVote.php?id=' + this.props.navigation.state.params.Id)
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({numberOfVote: responseJson[0].vote});
                console.log(responseJson);


            })
            .catch((error) => {
            })
    }

    submitVote() {

        return fetch('http://71dongkhoi.esy.es/submit_vote.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: globalStore.getStateOf('Login').loginId,
                id: this.props.navigation.state.params.Id
            })

        }).then((response) => response.json())
            .then((responseJson) => {

                    if (responseJson === 'UNVOTED') {
                        this.setState({voted: false});

                    }
                    if (responseJson === 'VOTED') {
                        this.setState({voted: true});
                    }
                    this.getVote();

                }
            )
            .catch((error) => {
            })
    }

    checkVote() {
        return fetch('http://71dongkhoi.esy.es/check_vote.php',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: globalStore.getStateOf('Login').loginId,
                    id: this.props.navigation.state.params.Id
                })

            })
            .then((response) => response.json())
            .then((responseJson) => {
                    console.log('Check')
                    console.log(responseJson);
                    if (responseJson === 'NOTVOTED') {
                        this.setState({voted: false});
                    }
                }
            )
            .catch((error) => {
            })
    }


    LoadTeamReq = () => {
        return fetch('http://71dongkhoi.esy.es/getTeamRequest.php?id=' + globalStore.getStateOf('Login').loginId)
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson === "not found") {
                    this.setState({
                        dataSourceTeam: [],
                        numberTeam: 0
                    });
                    return;
                }
                this.setState({
                    dataSourceTeam: responseJson,
                    numberTeam: responseJson.length
                });
            })
            .catch((error) => {
            })
    }

    LoadTeamInfo = async () => {
        return await fetch('http://71dongkhoi.esy.es/getTeamInfo.php?adminId=' + this.props.navigation.state.params.Id)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({team: responseJson[0]});
            })
            .catch((error) => {
                console.error(error);
            });
    };

    LoadTeamUser = async () => {
        return await fetch('http://71dongkhoi.esy.es/getTeamUsers.php?id=' + this.state.id)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(this.state.id);
                console.log("Team's member:")
                console.log(responseJson);
                if (responseJson !== 'not found') {
                    console.log("Member :");
                    console.log(responseJson);
                    this.setState({members: responseJson});
                }
            })
            .catch((error) => {
                console.error(error);
            });

    };

    _navigateBackPressed() {

    }

    _settingProfilePressed = () => {
        this.props.navigation.navigate('ProfileSetting');
    }

    _followPressed() {
    }

    _callPressed(number) {
        call({number: number, prompt: false}).catch(console.error)
    }

    showListRequestPressed = () => {
        this.setState({modalVisibleTeam: true});

        if (this.state.numberTeam === 0) {
            this.setState({dataSourceTeam: []});
            return;
        }

        fetch('http://71dongkhoi.esy.es/getTeamRequest.php?id=' + globalStore.getStateOf('Login').loginId)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson === "not found") {
                    this.setState({
                        dataSourceTeam: [],
                        numberTeam: 0
                    });
                    return;
                }

                this.setState({
                    dataSourceTeam: responseJson
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    hideListRequestPressed = () => {
        this.setState({modalVisibleTeam: false});
    };

    acceptTeamRequest = (user) => {

        if (this.state.numberTeam === 0) {
            this.setState({dataSourceTeam: []});
            return;
        }
        fetch('http://71dongkhoi.esy.es/acceptTeamRequest.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.id,
                id: this.state.id,

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.showListRequestPressed();
                this.setState({
                    isLoading: false,
                });

                this.LoadTeamUser();
                var num = this.state.numberTeam;
                this.setState({numberTeam: num - 1})
                this.forceUpdate();
            }).catch((error) => {
            console.error(error);

        })
    };

    denyTeamRequest = (user) => {
        if (this.state.numberTeam === 1) {
            this.setState({dataSourceTeam: [], numberTeam: 0});
            // this.setState({
            //     modalVisibleTeam:false
            // })
        }
        fetch('http://71dongkhoi.esy.es/deleteTeamRequest.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.id,
                id: globalStore.getStateOf('Login').loginId,

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.showListRequestPressed();
                this.setState({
                    isLoading: false,
                });
                console.log(user.id + " aaa " + this.state.Id);


// Showing response message coming from server after inserting records.

            }).catch((error) => {
            console.error(error);

        })
    };

    renderRow(member) {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    height: 55,
                    alignItems: 'center',
                    width: '90%',
                    justifyContent: 'space-between',
                    borderBottomWidth: 0.5,
                    borderColor: 'rgba(220,220,220,0.8)',
                }}>
                <TouchableOpacity
                    style={{alignItems: 'center', flexDirection: 'row',}}
                    onPress={() => {
                        this.props.navigation.navigate('GuestProfile', {
                            Id: member.id,
                        })
                    }}>
                    <Image source={{uri: member.url, width: 50, height: 50}} style={profileStyles.avatar}/>

                    <Text style={{marginLeft: 60, fontSize: 15}}>{member.name}</Text>
                </TouchableOpacity>
                {
                    (member.id === this.state.id) ?
                        <Image
                            source={{
                                uri: "https://firebasestorage.googleapis.com/v0/b/testdatabase-41f31.appspot.com/o/31138145_1603113039787890_2381829420290670592_n.png?alt=media&token=cc7b98e8-4479-4209-9310-bb909029c004",
                                width: 50,
                                height: 35
                            }}
                            style={{width: 50, height: 35, resizeMode: 'stretch'}}/>
                        : <View style={{backgroundColor: 'red'}}/>
                }
            </View>
        );
    }

    render() {
        return (
            <View style={{flex: 1, width: '100%', backgroundColor: 'rgba(240,240,240,1)'}}>

                <View style={profileStyles.navigateBar}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.goBack()
                    }}>
                        <ElementIcon name="keyboard-backspace" color="white"/>
                    </TouchableOpacity>
                    {
                        (this.state.id === this.state.loginId) ?

                            <TouchableOpacity onPress={this._settingProfilePressed.bind(this)}>
                                <ElementIcon name="settings" color="white"/>
                            </TouchableOpacity> : <View/>

                    }
                </View>
                <ScrollView style={{flex : 1}}>
                    <View
                        style={{
                            flex: 4.5,
                            backgroundColor: 'white',
                        }}>
                        <View style={{
                            width: '100%',
                            aspectRatio: 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#F5F5F5'
                        }}>
                            <View
                                style={profileStyles.AvatarBorder}>
                                <Image
                                    source={{uri: this.state.team.url}}
                                    style={{
                                        width: '93%',
                                        aspectRatio: 1,
                                        borderColor: '#757575',
                                        borderWidth: 1,
                                        borderRadius: 2,
                                    }}>
                                </Image>
                            </View>
                        </View>
                        <View style={profileStyles.nameView}>
                            <View style={profileStyles.headerSubContent}>
                                {
                                    (this.state.id === globalStore.getStateOf('Login').loginId) ?

                                        <View style={{
                                            width: 40,
                                            aspectRatio: 1,
                                            alignItems: 'center',
                                            backgroundColor: '#27ae60'
                                        }}
                                              onPress={this.showListRequestPressed.bind(this)}>
                                            <Text
                                                style={{color: "white", fontSize: 15}}>{this.state.numberOfVote}</Text>
                                            <Icon size={15} name='md-thumbs-up' color="white"/>
                                        </View>
                                        : <View/>
                                }
                                <Text style={profileStyles.name}>{this.state.team.name}</Text>
                            </View>
                            {
                                (this.state.id === globalStore.getStateOf('Login').loginId)
                                    ? <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>

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
                                                              onPress={this.showListRequestPressed.bind(this)}>
                                                <FontAwesome size={30} name='globe' color={'#27ae60'}/>
                                                {
                                                    this.state.numberTeam === 0 ? <View/> :
                                                        <View style={{
                                                            backgroundColor: 'red',
                                                            width: 18,
                                                            height: 18,
                                                            alignItems: 'center',
                                                            borderRadius: 5,
                                                            marginLeft: -8,
                                                        }}>

                                                            <Text
                                                                style={{color: 'white'}}>{this.state.numberTeam}</Text>

                                                        </View>
                                                }
                                            </TouchableOpacity>
                                            <Text style={{fontWeight: 'bold', fontSize: 10, color:'#27ae60'}}>Xin vào đội</Text>
                                        </View>


                                    </View>
                                    :
                                    <TouchableOpacity
                                        style={{
                                            height: '100%',
                                            aspectRatio: 3,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => {
                                            this.submitVote()
                                        }}>
                                        <Text style={{
                                            fontSize: 30,
                                            color: "#2980b9",
                                            marginRight: 3
                                        }}>{this.state.numberOfVote}</Text>
                                        <Icon name="md-thumbs-up" size={ICON_SIZE.EXTRA}
                                              color={this.state.voted === true ? '#2980b9' : ICON_COLOR.CONTENT_COLOR_TWO}/>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{flex: 3, marginTop: 5, backgroundColor: 'white'}}>
                        <View style={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            paddingLeft: 20,
                            paddingRight: 10,
                            paddingTop: 2,
                            marginBottom: 2
                        }}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{"Thành viên : "}</Text>
                        </View>
                        <ListView
                            style={{marginLeft: 50}}
                            dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.members)}
                            renderRow={this.renderRow.bind(this)}/>

                    </View>
                    <View style={{flex: 2.5, marginTop: 5, backgroundColor: 'white'}}>
                        <View style={{flex: 1}}>
                            <View style={profileStyles.infoView}>
                                <Icon name="md-call" size={30} color="#16a085"/>
                                <View style={{borderBottomWidth: 1, borderColor: '#ecf0f1', padding: 10, flex: 1}}>
                                    <Text style={profileStyles.infoText}>{this.state.team.phone}</Text>
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
                                        <Text style={profileStyles.infoText}>{this.state.team.about}</Text>
                                    </ScrollView>


                                </View>
                            </View>
                        </View>

                    </View>
                </ScrollView>
                <Modal animationType="slide" transparent={false} visible={this.state.modalVisibleTeam}
                       onRequestClose={() => {
                       }}>
                    <View style={{marginTop: 22, justifyContent: 'center'}}>
                        <View style={{borderBottomWidth: 1, borderColor: '#bdc3c7', marginBottom: 3}}>
                            <TouchableOpacity
                                style={{alignSelf: 'center'}}
                                onPress={this.hideListRequestPressed}>
                                <Icon size={35} name="ios-arrow-down-outline" color="grey"/>
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.numberTeam === 0 ?
                                <View style={{
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{fontSize: 15, alignSelf: 'center'}}>No request</Text>
                                </View> :
                                <ListView
                                    dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.dataSourceTeam)}
                                    renderRow={this.renderRowReq.bind(this)}/>
                        }

                    </View>
                </Modal>

            </View>
        );
    };

    renderRowReq(user) {
        return (
            <TouchableOpacity style={styles.TouchableRequestItems}>

                <Image style={{width: 70, height: 70, borderRadius: 50}}
                       source={{uri: user.url}}/>
                <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 18}}>{user.name}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 30,}}>
                            <TouchableOpacity style={styles.TouchableItemViewProfile}>
                                <Text style={{fontWeight: 'bold', color: '#16a085'}}>View profile</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <TouchableOpacity style={{justifyContent: 'center'}}
                                      onPress={() => {
                                          this.acceptTeamRequest(user)
                                      }}>
                        <Icon size={30} name="md-checkmark-circle" color="#27ae60"/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{justifyContent: 'center', marginLeft: 10, marginRight: 5}}
                                      onPress={() => {
                                          this.denyTeamRequest(user);
                                      }}>
                        <Icon size={30} name="md-remove-circle" color="#e74c3c"/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

        )
    }


}

const profileStyles = StyleSheet.create(
    {
        AvatarBorder: {
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#E0E0E0',
            borderWidth: 0.8,
            borderRadius: 2,
            width: '40%',
            aspectRatio: 1,
            backgroundColor: 'white'
        },
        navigateBar: {
            flexDirection: 'row',
            width: '100%',
            height: "10%",
            justifyContent: 'space-between',
            backgroundColor: '#27ae60',
            alignItems: 'center',
            paddingLeft: '4%',
            paddingRight: '4%',
        },
        header: {
            width: '100%', justifyContent: 'center', flex: 1,
        },
        headerSubContent: {
            flexDirection: 'row',
            alignContent: 'center',
            marginBottom: 8,
            justifyContent: 'flex-end',
            marginRight: 10,
        },

        name: {
            fontWeight: 'bold', fontSize: 20, marginLeft: '1%', marginTop: '10%'
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
        nameView: {
            height: '8%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2%',
            marginBottom: '2%',
            paddingLeft: '4%',
            paddingRight: '2%',
        },

        avatar: {
            marginLeft: 5,
            width: 40,
            height: 40,
            borderRadius: 25,
            position: 'absolute',
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
        Image: {
            borderRadius: 100,
            width: 147.5,
            height: 147.5,

        }


    }
);

const styles = StyleSheet.create({
    NavigateTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    NavigateView: {
        flexDirection: 'row',
        height: 50,
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingRight: 20,
        paddingLeft: 20
    },

    ImageTouchable: {
        borderRadius: 85,
        width: 150, height: 150,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#16a085',
        alignItems: 'center',
        justifyContent: 'center'
    },

    ImageBackground: {
        height: 300,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ImageStyle: {
        borderRadius: 100,
        width: 147.5,
        height: 147.5,
    },
    telIcon: {
        //marginBottom:10,
        color: 'grey',
        fontSize: 30,
    },
    TextInputStyleClass: {
        backgroundColor: 'white',
        marginLeft: 20,
        textAlign: 'left',
        width: '100%',
        marginTop: 7,
        marginBottom: 7,
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#ecf0f1'
    },

    TextInputAboutStyle: {
        height: 80,
        width: '100%',
        marginLeft: 20,
        textAlignVertical: 'top',
        borderBottomWidth: 1,
        borderColor: '#ecf0f1'
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
    Image: {
        borderRadius: 100,
        width: 147.5,
        height: 147.5,

    }


});