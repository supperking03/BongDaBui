import React, {Component} from 'react'
import {
    Text, View, TouchableOpacity, Image, ImageBackground, StyleSheet, ScrollView, ListView,
    TextInput,Dimensions
} from 'react-native'
import globalStore from "../../global";
import {height, width} from "react-native-dimension";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {Icon as ElementIcon, SocialIcon} from 'react-native-elements'
import {ConfirmDialog} from "react-native-simple-dialogs";
import {PRIMARY_COLOR, BACKGROUND_COLOR, CONTENT_COLOR} from "../../styles/color";
const fontSize = Dimensions.get('window').width * 0.04;

export default class SearchTeam extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                loginId: globalStore.getStateOf('Login').loginId,
                teams: [],
                confirmVisible: false,
                message: "",
            };
        this.LoadTeam();
    }

    LoadTeam = () => {
        this.setState({isLoading: true});
        return fetch('http://71dongkhoi.esy.es/getAllTeam.php?id=' + this.state.loginId)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson !== 'not found') {
                    this.setState({teams: responseJson});
                }
                this.setState({isLoading: false});
            })
            .catch((error) => {
                this.setState({isLoading: false});
            })
    };
    SendRequest = (teamId) => {
        return fetch('http://71dongkhoi.esy.es/submit_teamRequest.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: teamId,
                userId: this.state.loginId,
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson === 'Duplicated deal !')
                    this.setState({message: 'Bạn đã gửi yêu cầu rồi'});
                else
                    this.setState({message: 'Đã gửi yêu cầu'});
                this.setState({confirmVisible: true});
            }).catch((error) => {
                this.setState({message: 'Bạn đã gửi yêu cầu rồi'});
            });

    };

    renderRow(team) {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    height:100,
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    elevation:5,
                    backgroundColor:BACKGROUND_COLOR,
                    borderColor: 'rgba(220,220,220,0.8)',
                }}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('TeamProfile', {
                            Id: team.adminId
                        })
                    }}
                    style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={{uri: team.url}} style={profileStyles.avatar}/>
                    </View>
                    <View style={{flex: 3, justifyContent: 'center'}}>
                        <Text style={{fontSize: fontSize, fontWeight:'bold',marginLeft:10}}>{team.name}</Text>
                    </View>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity
                            onPress={() => this.SendRequest(team.adminId)}
                            style={profileStyles.sendReqButton}>
                            <Text style={{fontWeight:'bold',color:CONTENT_COLOR}}>THAM GIA</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

            </View>
        );
    }

    render() {
        return (
            <View style={{
                flex: 1,
                position: 'absolute',
                width: width(100),
                height: height(90),
                marginBottom: 0,
                backgroundColor: BACKGROUND_COLOR
            }}>
                <View style={profileStyles.navigateBar}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.goBack()
                    }}>
                        <ElementIcon name="keyboard-backspace" color="white"/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}> Danh sách đội bóng </Text>
                    <View/>
                </View>

                <View style={{flex: 9}}>
                    <ListView
                        style={{marginLeft: 5}}
                        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.teams)}
                        renderRow={this.renderRow.bind(this)}/>
                </View>
                <ConfirmDialog
                    title="Xác nhận"
                    message={this.state.message}
                    visible={this.state.confirmVisible}
                    onTouchOutside={() => this.setState({confirmVisible: false})}
                    positiveButton={{
                        title: "OK",
                        onPress: () => {
                            this.setState({confirmVisible: false});
                        }
                    }}
                />

            </View>
        );
    }

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
            paddingRight: 20,
        },
        avatar: {
            width: '100%',
            aspectRatio:1,
            borderRadius: 100,
            borderWidth: 3,
            borderColor: 'white'
        },
        sendReqButton: {
            backgroundColor: 'white',
            width: 100,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth:1,
            borderColor:CONTENT_COLOR,
            borderRadius:5
        },
    });