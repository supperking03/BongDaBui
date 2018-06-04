import React, {Component} from 'react'
import {Text, View, TouchableOpacity, ListView, Image, StyleSheet, TextInput} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Icon as MatIcon} from 'react-native-elements'
import Accordion from 'react-native-collapsible/Accordion';
import {height, width} from "react-native-dimension";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


import ModalDropdown from 'react-native-modal-dropdown';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import globalStore from "../../global";
import {ProgressDialog} from "react-native-simple-dialogs";
import {CRUCIAL_TEXT_STYLES} from "../../styles/text";
import {BACKGROUND_COLOR, BACKGROUND_COLOR_TWO, CONTENT_COLOR} from "../../styles/color";

export default class TeamManager extends Component {

    static  navigationOptions = {
        tabBarLabel: 'Đội bóng',
        tabBarIcon: () => <MaterialCommunityIcons size={24} name="account-group" color="white"/>
    };

    constructor(props) {
        super(props);

        this.state = {
            myTeam: {
                id: globalStore.getStateOf('Login').loginId,
                name: '',
                url: '',
                about: '',
                phone: '0906889249',
            },
            teamFollow: [],
            isHaveTeam: false,
            isLoading: false,
            _this: this,
        };

        globalStore.register('TeamManager',
            (s) => this.setState(s),
            () => {
                return this.state
            });
        globalStore.setStateOf('Home', {teamLoaded: true});
        this.LoadData();
    }


    LoadData = async () => {
        this.setState({isLoading: true});
        return await fetch('http://71dongkhoi.esy.es/getFollowedTeam.php?id=' + this.state.myTeam.id)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson !== 'not found') {
                    let array = responseJson;
                    let index = -1;
                    array.map((team, idx) => {
                        if (team.id === this.state.myTeam.id) {
                            index = idx;
                        }
                    });

                    if (index !== -1) {
                        this.setState({myTeam: array[index]});
                        this.setState({isHaveTeam: true});
                        array.splice(index, 1);
                    }
                    this.setState({teamFollow: array});
                }
                this.setState({isLoading: false});

            })
            .catch((error) => {
                console.error(error);
            });

    };

    renderRow(team) {
        return (
            <TouchableOpacity
                style={{
                    width: '100%',
                    height: 100,
                    flexDirection: 'row',
                    margin: 1,

                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: BACKGROUND_COLOR_TWO
                }}
                onPress={() => {
                    this.props.navigation.navigate('TeamProfile', {
                        Id: team.adminId
                    })
                }
                }>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image style={{height: '90%', aspectRatio: 1}} source={{uri: team.url}}/>
                </View>
                <View style={{flex: 3, justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <View style={{marginLeft: 10}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>{team.name}</Text>
                            <Text style={{fontSize: 15}}>{team.about}</Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>


        )
    };

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

                <View style={{flex: 2.3, justifyContent: 'center'}}>
                    <View style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 2,
                        paddingBottom: 2
                    }}>
                        <Text style={CRUCIAL_TEXT_STYLES.PRIMARY_COLOR}>Đội của bạn : </Text>
                    </View>
                    {
                        (this.state.isHaveTeam === true) ?
                            <TouchableOpacity
                                style={{
                                    width: '100%',
                                    height: 100,
                                    flexDirection: 'row',
                                    margin: 1,
                                    borderWidth: StyleSheet.hairlineWidth,
                                    borderColor: BACKGROUND_COLOR_TWO
                                }}
                                onPress={() => {
                                    this.props.navigation.navigate('TeamProfile', {
                                        Id: globalStore.getStateOf('Login').loginId
                                    })
                                }
                                }>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image style={{height: '90%', aspectRatio: 1}}
                                           source={{uri: this.state.myTeam.url}}/>
                                </View>
                                <View style={{flex: 3, justifyContent: 'space-between', flexDirection: 'row'}}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <View style={{marginLeft: 10}}>
                                            <Text style={{
                                                fontWeight: 'bold',
                                                fontSize: 18
                                            }}>{this.state.myTeam.name}</Text>
                                            <Text style={{fontSize: 15}}>{this.state.myTeam.about}</Text>
                                        </View>
                                    </View>

                                </View>
                            </TouchableOpacity>
                            :
                            <View style={{
                                width: '100%',
                                height: height(15),
                                flexDirection: 'row',
                                borderTopWidth: 1,
                                borderColor: '#bdc3c7',
                                marginLeft: 20
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('ProfileSetting');
                                    }}
                                    style={{flexDirection: 'row', alignItems: 'center'}}
                                >
                                    <Ionicons name="ios-add-circle-outline" size={height(7)} color="#4CAF50"/>
                                    <Text style={{fontSize: height(3), color: "#4CAF50", marginLeft: 5}}>Tạo đội của
                                        bạn</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
                <View style={{flex: 7}}>
                    <View style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: 5,
                        marginBottom: 2,
                        marginTop: 20,
                    }}>
                        <Text style={CRUCIAL_TEXT_STYLES.PRIMARY_COLOR}>Đội bạn tham gia :</Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('Search');
                            }}>
                            <Text style={[CRUCIAL_TEXT_STYLES.CONTENT_COLOR_TWO,{textDecorationLine: 'underline' } ]}>Tìm kiếm đội bóng</Text>
                        </TouchableOpacity>
                    </View>
                    <ListView
                        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.teamFollow)}
                        renderRow={this.renderRow.bind(this)}/>

                </View>
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
        // borderWidth:2,
        // borderColor:'#16a085'
    },

    modalbtnText: {},
    dropdownstyle: {
        width: width(30),
        backgroundColor: 'white',
        alignSelf: 'flex-end'
    }
});


