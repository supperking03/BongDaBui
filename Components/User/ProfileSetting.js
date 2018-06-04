import React, {Component} from 'react';
import {Icon as EleIcon} from 'react-native-elements';
import {firebaseApp} from "../../FirebaseConfig";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import {
    StyleSheet, TextInput, View, Alert, Image, Text, ActivityIndicator,
    TouchableOpacity, ImageBackground, Modal, ListView, ScrollView
} from 'react-native';

import Share, {ShareSheet, Button} from 'react-native-share';

import FontAwesome from "react-native-vector-icons/FontAwesome";

import Spinner from 'react-native-loading-spinner-overlay';
import SocialIcon from "react-native-elements/src/social/SocialIcon";

import RNFetchBlob from 'react-native-fetch-blob';
import globalStore from "../../global";
import {ConfirmDialog, ProgressDialog} from "react-native-simple-dialogs";
import ImageResizer from "react-native-image-resizer/index.android";

const storage = firebaseApp.storage();
const fs = RNFetchBlob.fs;

const rq = window.XMLHttpRequest;
const bl = window.Blob;

const Blob = RNFetchBlob.polyfill.Blob;

var ImagePicker = require('react-native-image-picker');

var options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

const uploadImage = (id, uri, mime = 'image/jpeg') => {
    return new Promise((resolve, reject) => {
        const uploadUri = uri;
        const sessionId = id;
        let uploadBlob = null;
        const imageRef = storage.ref('images').child(`${sessionId}`);

        fs.readFile(uploadUri, 'base64')
            .then((data) => {
                window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
                window.Blob = Blob;
                return Blob.build(data, {type: `${mime};BASE64`})

            })
            .then((blob) => {
                uploadBlob = blob;
                return imageRef.put(blob, {contentType: mime})
            })
            .then(() => {
                uploadBlob.close();
                return imageRef.getDownloadURL()
            })
            .then((url) => {
                resolve(url)
                window.XMLHttpRequest = rq;
                window.Blob = bl;
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export default class User extends Component {
    constructor(props) {
        super(props);

        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            user: (globalStore.getStateOf('Login').homeLoaded === true)
                ? globalStore.getStateOf('Profile').user
                : {
                    id: globalStore.getStateOf('Login').loginId,
                    name: globalStore.getStateOf('Login').name,
                    url: globalStore.getStateOf('Login').url,
                    phone: '',
                },
            modalVisibleTeam: false,
            dataSourceTeam: [],
            numberTeam: 0,
            visible: false,
            teamState: "",
            isLoading: false,
            alert: "Thành công",
            alertVisible: false,

        };
        globalStore.register('ProfileSetting',
            (s) => this.setState(s),
            () => {
                return this.state
            });


    };

    componentDidMount() {
        if (this.state.user.phone === '') {
            alert('Hãy xác nhận số điện thoại');
        }
    }

    componentWillMount() {
    }

    InsertDataToServer = () => {

        this.setState({
            isLoading: true,
        });

        fetch('http://71dongkhoi.esy.es/submit_user_info.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                name: this.state.user.name,

                id: globalStore.getStateOf('Login').loginId,

                phone: this.state.user.phone,

                url: this.state.user.url,

                email: this.state.user.email,

                about: this.state.user.about,

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                });

// Showing response message coming from server after inserting records.
                this.setState({alertVisible: true});
                if (globalStore.getStateOf('Login').homeLoaded === true && globalStore.getStateOf('Home').userLoaded === true) {
                    globalStore.getStateOf('User')._this.LoadUserInfo();
                    globalStore.getStateOf('Profile')._this.LoadDealReq();
                }
                // if(globalStore.getStateOf('Login').homeLoaded === true)
                //     this.props.navigation.goBack();


            }).catch((error) => {
            console.error(error);
        });


    }

    navigateBackPressed = () => {
        this.props.navigation.goBack();
    };

    pickImagePressed = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    isLoading: true,
                });
                ImageResizer.createResizedImage(response.uri, 800, 600, 'JPEG', 80)
                    .then(({uri}) => {
                        uploadImage(this.state.user.id, uri)
                            .then(URL => this.setState(previousState => {
                                return {
                                    user: {
                                        ...previousState.user,
                                        url: URL,
                                    }
                                }
                            }))
                            .then(() => {
                                this.setState({isLoading: false});
                            })
                            .catch(error => console.log(error))
                    }).catch((err) => {
                    console.log(err);
                    return Alert.alert('Unable to resize the photo',
                        'Check the console for full the error message');
                });
            }
        });
    };

    render() {
        return (
            <KeyboardAwareScrollView>
                <View style={{flex: 1}}>
                    <View style={styles.ImageContainer}>

                        <ImageBackground style={styles.ImageBackground} source={{uri: this.state.user.url}}>

                            <View style={styles.NavigateView}>
                                <TouchableOpacity onPress={() => {this.navigateBackPressed()}}
                                                  style={styles.NavigateTouchable}>
                                    <EleIcon size={28} name="keyboard-backspace" color="white"/>
                                </TouchableOpacity>
                                {
                                    <View style={styles.NavigateTouchable}>
                                        <Text style={{color: 'white', fontSize: 17}}>Thiết lập tài khoản</Text>
                                    </View>
                                }
                                <TouchableOpacity onPress={() => {
                                    if (this.state.user.phone !== '' && this.state.user.name !== '') {
                                        this.InsertDataToServer();
                                        if (globalStore.getStateOf('Login').homeLoaded === false) {
                                            this.props.navigation.navigate('ManHinh_Manager');
                                        }
                                    }
                                    else {
                                        alert('Vui lòng xác nhận đầy đủ thông tin !')
                                    }


                                }} style={styles.NavigateTouchable}>
                                    <EleIcon size={28} name="done" color="white"/>

                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.65)',
                                    alignItems: 'center'
                                }}>
                                <View style={{
                                    marginLeft: 50, marginRight: 50, alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        this.pickImagePressed();
                                    }}
                                                      style={styles.ImageTouchable}>
                                        <Image style={styles.Image} source={{uri: this.state.user.url}}/>
                                        <View style={{
                                            backgroundColor: 'transparent',
                                            width: '100%', height: '100%',
                                            position: 'absolute',
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-end'
                                        }}>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        this.pickImagePressed();
                                    }}
                                                      style={{
                                                          marginTop: 10, alignItems: 'center',
                                                          flexDirection: 'row',
                                                          justifyContent: 'center'
                                                      }}>
                                        <EleIcon style={{}} size={20} name="create" color="#ecf0f1"/>
                                        <Text style={{color: 'white', fontSize: 15}}>Cập nhật ảnh đại diện</Text>
                                    </TouchableOpacity>


                                </View>
                            </View>
                        </ImageBackground>


                        <View style={{flex: 1, width: '100%', alignItems: 'center', backgroundColor: 'white'}}>
                            <View style={{width: '90%', borderBottomColor: 'grey', flexDirection: 'row',}}>
                                <EleIcon style={{}} size={30
                                } name="perm-contact-calendar" color="#7f8c8d"/>
                                <TextInput
                                    style={{fontSize : 15}}
                                    placeholder="Nhập tên của bạn"
                                    value={this.state.user.name}
                                    onChangeText={Name => this.setState(previousState => {
                                        return {
                                            user: {
                                                ...previousState.user,
                                                name: Name,
                                            }
                                        }
                                    })}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputStyleClass}/>
                            </View>


                            <View style={{width: '90%', borderBottomColor: 'grey', flexDirection: 'row',}}>
                                <TouchableOpacity
                                    style={{alignItems: 'center', justifyContent: 'center', flexWrap: "wrap"}}
                                    onPress={() => {
                                        this.props.navigation.navigate('PhoneAuth');
                                    }}>
                                    <EleIcon size={30} name="call" color="#7f8c8d"/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.TextInputStyleClass}
                                    onPress={() => {
                                        this.props.navigation.navigate('PhoneAuth');
                                    }}>
                                    <TextInput
                                        style={{fontSize : 15}}
                                        editable={false}
                                        placeholder="Xác thực số điện thoại"
                                        value={this.state.user.phone}
                                        onChangeText={PhoneNumber => this.setState(previousState => {
                                            return {
                                                user: {
                                                    ...previousState.user,
                                                    phone: PhoneNumber,
                                                }
                                            }
                                        })}
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='#bdc3c7'
                                    />
                                </TouchableOpacity>
                            </View>


                            <View style={{width: '90%', borderBottomColor: 'grey', flexDirection: 'row',}}>
                                <EleIcon style={{}} size={30} name="email" color="grey"/>
                                <TextInput
                                    style={{fontSize : 15}}
                                    placeholder="Nhập email"
                                    value={this.state.user.email}
                                    onChangeText={Email => this.setState(previousState => {
                                        return {
                                            user: {
                                                ...previousState.user,
                                                email: Email,
                                            }
                                        }
                                    })}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputStyleClass}/>
                            </View>


                            <View style={{
                                width: '90%',
                                borderBottomColor: 'grey',
                                flexDirection: 'row',
                                justifyContent: 'flex-start'
                            }}>
                                <View style={{height: 40, justifyContent: 'center'}}>
                                    <EleIcon style={{}} size={30} name="chrome-reader-mode" color="#7f8c8d"/>
                                </View>
                                <TextInput
                                    style={{fontSize : 15}}
                                    placeholder="Miêu tả...."
                                    multiline={true}
                                    numberOfLines={4}
                                    value={this.state.user.about}
                                    onChangeText={About => this.setState(previousState => {
                                        return {
                                            user: {
                                                ...previousState.user,
                                                about: About,
                                            }
                                        }
                                    })}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputAboutStyle}
                                />
                            </View>
                        </View>

                    </View>
                </View>
                <ConfirmDialog
                    title="Cập nhật thông tin"
                    message={this.state.alert}
                    visible={this.state.alertVisible}
                    onTouchOutside={() => this.setState({alertVisible: false})}
                    positiveButton={{
                        title: "OK",
                        onPress: () => {
                            this.setState({alertVisible: false})
                        },
                    }}
                />
                <ProgressDialog
                    visible={this.state.isLoading}
                    title="Cập nhật thông tin"
                    message="Đang cập nhật..."
                />
            </KeyboardAwareScrollView>
        );
    }


}

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

    ImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,

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