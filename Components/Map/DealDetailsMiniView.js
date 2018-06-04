import React, {Component} from 'react';
import {
    Button,
    Image,
    Platform,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import {width, height, totalSize} from 'react-native-dimension';

import {Icon} from 'react-native-elements'
import call from 'react-native-phone-call'
import Ionicons from "react-native-vector-icons/Ionicons";
import {ConfirmDialog} from 'react-native-simple-dialogs';


export default class DealDetailsMiniView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dialogVisible: false,
            confirmVisible: false,
            message: "",
        };
    };

    SendRequest = () => {

        fetch('http://71dongkhoi.esy.es/submit_dealRequest.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.props.TeamId,
                userId: this.props.MyId,
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson === 'Duplicated deal !')
                    this.setState({message: 'Bạn đã gửi yêu cầu rồi'});
                else
                    this.setState({message: 'Đã gửi yêu cầu'});
                if(responseJson === 'ERROR!')
                    this.setState({message: 'Hãy tạo đội để gửi yêu cầu'})
            }).catch((error) => {
            this.setState({message: 'Bạn đã gửi yêu cầu rồi'});
        });
        this.setState({confirmVisible: true});


    };


    render() {
        return (
            <View style={{flex: 1}}>
                <ConfirmDialog
                    title="Xác nhận"
                    message="Bạn có chắc chắn muốn mời đấu với đội này không?"
                    visible={this.state.dialogVisible}
                    onTouchOutside={() => this.setState({dialogVisible: false})}
                    positiveButton={{
                        title: "OK",
                        onPress: () => {
                            this.SendRequest();
                            this.setState({dialogVisible: false});
                        }
                    }}
                    negativeButton={{
                        title: "Không",
                        onPress: () => this.setState({dialogVisible: false})
                    }}
                />
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
                <View style={{flex: 3, justifyContent: 'center'}}>
                    <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View style={{flex: 2}}>
                            <View style={{alignItems: 'center', height: 100}}>
                                <Image source={{uri: this.props.avatar}}
                                       style={{width: width(15), height: width(15), margin: 15}}/>
                                <Text style={{fontSize: 15, color: '#2c3e50', fontWeight: 'bold',}}>
                                    {this.props.name}</Text>
                            </View>
                        </View>

                        <View style={{flex: 3}}>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 17, color: '#2c3e50', fontWeight: 'bold', marginTop: 10,}}>
                                    {"Tìm kèo :" + this.props.type}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                    <Icon name="location-on" size={20} color="#2c3e50"/>
                                    <Text style={{fontSize: 17, color: '#2c3e50', marginTop: 10,}}>
                                        {this.props.position}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                    <Icon name="date-range" size={20} color="#2c3e50"/>
                                    <Text style={{fontSize: 17, color: '#2c3e50', marginTop: 10,}}>
                                        {" " + this.props.date}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon name="access-time" size={20} color="#2c3e50"/>
                                    <Text style={{fontSize: 15, color: '#2c3e50', marginTop: 10,}}>
                                        {"  " + this.props.time1}</Text>
                                    <Text style={{fontSize: 15, color: '#2c3e50', marginTop: 10,}}>
                                        {"  " + this.props.time2}</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                                      onPress={() => {
                                          call({number: this.props.phone, prompt: false}).catch(console.error)
                                      }}>
                        <Icon size={28} name="call" color="#16a085"/>
                        <Text style={{color: '#16a085', flex: 1}}>Liên hệ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                                      onPress={() => {
                                          this.setState({dialogVisible: true});
                                      }}>
                        <Ionicons size={28} name="md-football" color="#16a085"/>
                        <Text style={{color: '#16a085', flex: 1}}>Mời đấu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                                      onPress={() => {
                                          this.props.This.props.navigation.navigate('TeamProfile', {
                                              Id: this.props.TeamId,
                                          });
                                      }}>
                        <Icon size={28} name="person-add" color="#16a085"/>
                        <Text style={{color: '#16a085', flex: 1}}>Thêm thông tin</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }


}

const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            //marginTop:-20
        },
        button1: {
            height: 8,
            alignItems: 'center',
            width: width(50),
            borderWidth: 2,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            borderColor: '#0078D7',

        },
        button2: {
            height: 8,
            alignItems: 'center',
            width: width(50),
            borderWidth: 2,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderColor: '#0078D7',
        }


    }
);