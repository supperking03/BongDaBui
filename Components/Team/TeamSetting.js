import React, {Component} from 'react';
import {firebaseApp} from "../../FirebaseConfig";
import {Icon as EleIcon} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import {
    StyleSheet, TextInput, View, Alert, Image, Text, ActivityIndicator,
    TouchableOpacity, ImageBackground, Modal, ListView,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import RNFetchBlob from 'react-native-fetch-blob';
import SocialIcon from "react-native-elements/src/social/SocialIcon";

import {ProgressDialog} from 'react-native-simple-dialogs';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import globalStore from "../../global";
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
        path: 'imagesTeam'
    }
};


const uploadImage = (adminId, uri, mime = 'image/jpeg') => {
    return new Promise((resolve, reject) => {
        const uploadUri = uri;
        const sessionId = adminId;
        let uploadBlob = null;
        const imageRef = storage.ref('imagesTeam').child(`${sessionId}`);

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

export default class CreateTeam extends Component {

    pickImage = () => {
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
                    progressVisible: true,
                });
                ImageResizer.createResizedImage(response.uri, 800, 600, 'JPEG', 80)
                    .then(({uri}) => {
                        uploadImage(this.state.team.adminId, uri)
                            .then(URL => this.setState(previousState => {
                                return {
                                    team: {
                                        ...previousState.team,
                                        url: URL,
                                    }
                                }
                            }))
                            .then(() => {
                                //this.InsertDataToServer();
                                this.setState({progressVisible: false})
                            })
                            .catch(error => console.log(error))
                    }).catch((err) => {
                    console.log(err);
                    return Alert.alert('Unable to resize the photo',
                        'Check the console for full the error message');
                });
            }
        });
    }

    componentDidMount() {
        return fetch('http://71dongkhoi.esy.es/getTeamRequest.php?adminId=' + this.state.TextInputId)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.length + "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                this.setState({
                    number: responseJson.length,
                })
            })
            .catch((error) => {
                console.error(error);
            })
    }


    constructor(props) {

        super(props);

        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            adminId: globalStore.getStateOf('Login').loginId,
            team: {
                adminId: globalStore.getStateOf('Login').loginId,
                phone: '',
                name: '',
                about: '',
                url: 'https://firebasestorage.googleapis.com/v0/b/testdatabase-41f31.appspot.com/o/h.jpg?alt=media&token=f48209c3-8ef4-45bd-9be0-e1ed0602dc65'
            },
            alertVisible: false,
            progressVisible: false,
            type: 'Cập nhật ảnh đại diện',

        };
        this.LoadPhoneNumber();
        this.LoadData();

    }

    LoadPhoneNumber = () => {
        return fetch('http://71dongkhoi.esy.es/getUser.php?id=' + globalStore.getStateOf('Login').loginId)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState(previousState => {
                    return {
                        team: {
                            ...previousState.team,
                            phone: responseJson[0].phone,
                        }
                    }
                })
            })
            .catch((error) => {
                console.error(error);
            });

    }

    LoadData = async () => {
        return await fetch('http://71dongkhoi.esy.es/getTeamInfo.php?adminId=' + this.state.adminId)
            .then((response) => response.json())
            .then((responseJson) => {
                //this.setState({users: responseJson});
                if (responseJson !== 'not found')
                    this.setState({team: responseJson[0]});
            })
            .catch((error) => {
                console.error(error);
            });
    };

    InsertDataToServer = () => {

        this.setState({progressVisible: true})
        console.log("URL");
        console.log(this.state.team.url);
        fetch('http://71dongkhoi.esy.es/submit_team_info.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                name: this.state.team.name,

                adminId: globalStore.getStateOf('Login').loginId,

                phone: this.state.team.phone,

                url: (this.state.team.url === undefined || this.state.team.url === '') ?
                    'https://firebasestorage.googleapis.com/v0/b/testdatabase-41f31.appspot.com/o/h.jpg?alt=media&token=f48209c3-8ef4-45bd-9be0-e1ed0602dc65'
                    : this.state.team.url,

                about: this.state.team.about

            })

        }).then((response) => response.json())
            .then((responseJson) => {


// Showing response message coming from server after inserting records.
                if (globalStore.getStateOf('Home').teamprofileLoaded === true) {
                    globalStore.getStateOf('TeamProfile')._this.LoadTeamInfo();
                    globalStore.getStateOf('TeamProfile')._this.LoadTeamUser();
                }
                globalStore.getStateOf('TeamManager')._this.LoadData();

                this.setState({progressVisible: false, alertVisible: true})
                this.props.navigation.goBack();

            }).catch((error) => {
            console.error(error);
        });


    }

    render() {
        return (
            <KeyboardAwareScrollView>
                <View style={{flex: 1}}>
                    <View style={styles.ImageContainer}>
                        <View style={{
                            flexDirection: 'row',
                            height: "10%",
                            width: '100%',
                            justifyContent: 'space-between',
                            backgroundColor: '#27ae60',
                            paddingRight: '4%',
                            paddingLeft: '4%'
                        }}>
                            <TouchableOpacity
                                onPress={() => {

                                    this.props.navigation.goBack();
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                <EleIcon size={28} name="keyboard-backspace" color="white"/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    if (this.state.team.name !== '') {
                                        this.setState({type: 'Cập nhật thông tin đội'})
                                        this.InsertDataToServer();
                                    }
                                    else {
                                        alert('Nhập tên đội bóng');
                                    }
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                <EleIcon size={28} name="done" color="white"/>
                            </TouchableOpacity>
                        </View>
                        <ImageBackground style={{
                            height: 250,
                            width: '100%',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                        }} source={{uri: this.state.team.url}}>
                            <View
                                style={{
                                    width: '50%',
                                    backgroundColor: 'rgba(0,0,0,0.65)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <TouchableOpacity onPress={this.pickImage} style={{
                                        marginTop: 10,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'center'
                                    }}>
                                        <EleIcon style={{}} size={20} name="create" color="#ecf0f1"/>
                                        <Text style={{color: 'white', fontSize: 15}}>Cập nhật ảnh đại diện đội</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                        <View style={{
                            flex: 1,
                            width: '100%',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            marginTop: 30
                        }}>
                            <View style={{width: '90%', borderBottomColor: 'grey', flexDirection: 'row',}}>
                                <EleIcon style={{}} size={30} name="perm-contact-calendar" color="#7f8c8d"/>

                                <TextInput
                                    // Adding hint in Text Input using Place holder.
                                    placeholder="Tên đội"
                                    maxLength={15}
                                    value={this.state.team.name}
                                    onChangeText={name => this.setState(previousState => {
                                        return {
                                            team: {
                                                ...previousState.team,
                                                name: name,
                                            }
                                        }
                                    })}
                                    // Making the Under line Transparent.
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputStyleClass}
                                />
                            </View>
                            <View style={{width: '90%', borderBottomColor: 'grey', flexDirection: 'row',}}>
                                <EleIcon style={{}} size={30} name="call" color="#7f8c8d"/>

                                <TextInput
                                    value={this.state.team.phone}
                                    // Adding hint in Text Input using Place holder.
                                    placeholder="Số điện thoại đội trưởng"
                                    editable={false}
                                    onChangeText={phone => this.setState(previousState => {
                                        return {
                                            team: {
                                                ...previousState.team,
                                                phone: phone,
                                            }
                                        }
                                    })}

                                    // Making the Under line Transparent.
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputStyleClass}
                                />
                            </View>
                            <View style={{
                                width: '90%',
                                borderBottomColor: 'grey',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                            }}>
                                <View style={{height: 40, justifyContent: 'center'}}>
                                    <EleIcon style={{}} size={30} name="chrome-reader-mode" color="#7f8c8d"/>
                                </View>
                                <TextInput
                                    // Adding hint in Text Input using Place holder.
                                    placeholder="Giới thiệu.."
                                    multiline={true}
                                    numberOfLines={4}

                                    value={this.state.team.about}
                                    onChangeText={about => this.setState(previousState => {
                                        return {
                                            team: {
                                                ...previousState.team,
                                                about: about,
                                            }
                                        }
                                    })}

                                    // Making the Under line Transparent.
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={{
                                        height: 80,
                                        width: '100%',
                                        marginLeft: 20,
                                        textAlignVertical: 'top',
                                        borderBottomWidth: 1,
                                        borderColor: '#ecf0f1'
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <ConfirmDialog
                    title={this.state.type}
                    message="Lưu thành công"
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
                    visible={this.state.progressVisible}
                    message="Đang cập nhật..."
                />
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({

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
// Set border Hex Color Code Here.

// Set border Radius.
        //borderRadius: 10 ,
    }

});