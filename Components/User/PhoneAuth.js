import React, {Component} from 'react';
import {View, Button, Text, TextInput, Image, StyleSheet, TouchableOpacity} from 'react-native';

import firebase from 'react-native-firebase';
import globalStore from "../../global";
import {Icon as ElementsIcon, SocialIcon} from 'react-native-elements'

const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

export default class PhoneAuth extends Component {
    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            user: null,
            message: '',
            codeInput: '',
            phoneNumber: ("+84" + globalStore.getStateOf('ProfileSetting').user.phone).replace('+840', '+84'),
            confirmResult: null,
        };
    }

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({user: user.toJSON()});
            } else {
                // User has been signed out, reset the state
                this.setState({
                    user: null,
                    message: '',
                    codeInput: '',
                    phoneNumber: ("+84" + globalStore.getStateOf('ProfileSetting').user.phone).replace('+840', '+84'),
                    confirmResult: null,
                });
            }
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    signIn = () => {
        const {phoneNumber} = this.state;
        this.setState({message: 'Đang gửi mã...'});

        firebase.auth().signInWithPhoneNumber(phoneNumber)
            .then(confirmResult => this.setState({confirmResult: confirmResult, message: 'Mã đã được gửi !'}))
            .catch(error => this.setState({message: 'Lỗi xác nhận số điện thoại' + error}));
    };

    confirmCode = () => {
        const {codeInput, confirmResult} = this.state;

        if (confirmResult && codeInput.length) {
            confirmResult.confirm(codeInput)
                .then((user) => {
                    this.setState({message: 'Đã xác nhận thành công!'});
                    let newUser = Object.assign({}, globalStore.getStateOf('ProfileSetting').user);
                    newUser.phone = this.state.phoneNumber.replace("+84", "0");
                    globalStore.setStateOf('ProfileSetting', {user: newUser});
                    //this.props.navigation.goBack();
                })
                .catch(error => this.setState({message: `Lỗi xác nhận số điện thoại`}));
        }
    };

    signOut = () => {
        firebase.auth().signOut();
    }

    renderPhoneNumberInput() {
        const {phoneNumber} = this.state;

        return (
            <View style={{padding: 25}}>
                <Text>Nhập số điện thoại:</Text>
                <TextInput
                    autoFocus
                    style={{height: 40, marginTop: 15, marginBottom: 15}}
                    onChangeText={value => this.setState({phoneNumber: value})}
                    placeholder={'Nhập số điện thoại ... '}
                    value={phoneNumber}
                />
                <TouchableOpacity
                    style={{
                        backgroundColor: 'green',
                        height: 30,
                        borderRadius: 3,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={() => {
                        this.signIn()
                    }}>
                    <Text style={{fontSize: 20, color: 'white'}}>Gửi mã xác nhận</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderMessage() {
        const {message} = this.state;

        if (!message.length) return null;

        return (
            <Text style={{padding: 5, backgroundColor: '#000', color: '#fff'}}>{message}</Text>
        );
    }

    renderVerificationCodeInput() {
        const {codeInput} = this.state;

        return (
            <View style={{marginTop: 25, padding: 25}}>
                <Text>Nhập mã xác nhận bên dưới:</Text>
                <TextInput
                    autoFocus
                    style={{height: 40, marginTop: 15, marginBottom: 15}}
                    onChangeText={value => this.setState({codeInput: value})}
                    placeholder={'Mã xác nhận ... '}
                    value={codeInput}
                />
                <Button title="Xác nhận" color="#841584" onPress={this.confirmCode}/>
            </View>
        );
    }

    render() {
        const {user, confirmResult} = this.state;
        return (
            <View style={{flex: 1}}>

                {!user && !confirmResult && this.renderPhoneNumberInput()}

                {this.renderMessage()}

                {!user && confirmResult && this.renderVerificationCodeInput()}

                {user && (
                    <View
                        style={{
                            padding: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#77dd77',
                            flex: 1,
                        }}
                    >
                        <Image source={{uri: successImageUri}} style={{width: 100, height: 100, marginBottom: 25}}/>
                        <Text style={{fontSize: 25}}>Xác nhận số điện thoại thành công !</Text>
                        <View
                        style={{alignSelf: 'center', flexDirection: 'row' , justifyContent : 'space-between', width : 300 , height: 50}}>
                            <TouchableOpacity
                                style={{
                                    width: 100,
                                    height: 50,
                                    borderRadius: 10,
                                    backgroundColor: '#16a085',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={() => {
                                    this.signOut();
                                }}>
                                <Text style={{fontSize: 15, color: 'white'}}>{'< Đổi số'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: 100,
                                    height: 50,
                                    borderRadius: 10,
                                    backgroundColor: '#16a085',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={() => {
                                    let newUser = Object.assign({}, globalStore.getStateOf('ProfileSetting').user);
                                    newUser.phone = this.state.phoneNumber.replace("+84", "0");
                                    globalStore.setStateOf('ProfileSetting', {user: newUser});
                                    this.props.navigation.goBack();
                                }}>
                                <Text style={{fontSize: 15, color: 'white'}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerUpper: {
        height: 50,
        backgroundColor: '#27ae60',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    backButton: {alignItems: 'flex-start', padding: 10, flex: 1},

});
