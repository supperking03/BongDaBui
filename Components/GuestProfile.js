import React, {Component} from 'react'
import {
    Text, View, TouchableOpacity, Image, ImageBackground, StyleSheet, ScrollView, Alert,
} from 'react-native'
import {Icon as ElementsIcon, SocialIcon} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import call from "react-native-phone-call";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {height, width} from "react-native-dimension";
import globalStore from "../global";
import {ProgressDialog} from "react-native-simple-dialogs";

const iconSize={
    regular: 30
}

export default class GuestProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            isLoading: true,
            _this: this,

        }
        this.onBackPress = this.onBackPress.bind(this);
        this.LoadUserInfo();

    }

    onBackPress() {
        this.props.navigation.goBack();
    }

    LoadUserInfo = () => {
        this.setState({isLoading : true});
        return fetch('http://71dongkhoi.esy.es/getUser.php?id=' + this.props.navigation.state.params.Id)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({user: responseJson[0], isLoading : false});
            })
            .catch((error) => {
                console.error(error);
                this.setState({isLoading : false});
            });

    }

    _callPressed(number) {
        call({number: number, prompt: false}).catch(console.error)
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <View style={styles.headerUpper}>
                        <TouchableOpacity style={styles.backButton} onPress={this.onBackPress}>
                            <ElementsIcon name="keyboard-arrow-left" size={iconSize.regular} color="white"/>
                        </TouchableOpacity>
                        <Text style={styles.name}>{this.state.user.name}</Text>
                    </View>
                    <View style={styles.headerBody}/>
                    <Image style={styles.image} source={{uri: this.state.user.url}}/>
                </View>


                <View style={styles.body}>
                    <View style={styles.infoRow}>
                        <Icon name="md-call" size={iconSize.regular} color="#16a085"/>
                        <Text style={styles.infoText}>{this.state.user.phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="md-mail" size={iconSize.regular} color="#16a085"/>
                        <Text style={styles.infoText}>{this.state.user.email}</Text>
                    </View>
                    <View style={styles.aboutRow}>
                        <Icon name="md-clipboard" size={iconSize.regular} color="#16a085"/>
                        <ScrollView style={styles.scrollView}>
                            <Text style={styles.infoRow}>{this.state.user.about}</Text>
                        </ScrollView>
                    </View>
                </View>


            </View>
        );
    }
    ;


}
const styles = StyleSheet.create({
        container: {flex: 1},
        header: {height: width(60), backgroundColor: '#27ae60'},
        image: {
            position: 'absolute',
            borderRadius: 100,
            aspectRatio: 1,
            width: '30%',
            marginTop: width(15),
            marginLeft: 20,
            borderWidth: 2, borderColor: 'white'
        },
        backButton: {alignSelf: 'flex-start', padding: 10},

        headerUpper: {flex: 1, backgroundColor: '#27ae60', justifyContent: 'space-between'},
        headerBody: {flex: 1, backgroundColor: 'white'},

        name: {marginLeft: width(30) + 20, alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 25},
        socialButtonContainer: {flexDirection: 'row', marginLeft: width(30) + 20, alignSelf: 'center'},
        socialIcon: {width: 30, height: 30, marginRight: 3},

        body: {flex: 1, backgroundColor: 'white'},
        infoRow: {flexDirection: 'row', marginTop: 10, marginLeft: 20, marginRight: 20},
        aboutRow: {flexDirection: 'row', marginTop: 10, marginLeft: 20, marginRight: 20, flex: 1},
        infoText: {borderBottomWidth: 1, borderColor: '#ecf0f1', padding: 10, flex: 1},
        scrollView: {flexWrap: 'wrap'}
    }
);
