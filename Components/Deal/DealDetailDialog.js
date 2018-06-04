import React, {Component} from 'react'
import {Image, ImageBackground, StyleSheet, Text, View} from "react-native";
import {width} from "react-native-dimension";
import {TEXT_FONT_REGULAR} from "../../styles/text";


export default class DealDetailDialog extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ImageBackground
                    style={styles.imageBackground}
                    source={{uri: 'https://png.pngtree.com/thumb_back/fw800/back_pic/03/73/20/0557b9c92034b39.jpg'}}>
                    <View style={styles.imageBackgroundContent}>
                        <View style={{flex: 3}}>
                            <View style={styles.imageContainer}>
                                <View style={styles.imageBorder}>
                                    <Image
                                        source={{uri: this.props.team.url}}
                                        style={styles.circleAvatar}
                                    />
                                </View>
                                <Text style={styles.whiteText}>{this.props.team.name}</Text>

                            </View>
                        </View>
                        <View style={[styles.circleAvatar, {flex: 1}]}>
                            <Text style={{fontWeight: 'bold', fontSize: 25, color: 'white'}}>VS</Text>
                        </View>
                        <View style={{flex: 3}}>

                            <View style={styles.imageContainer}>
                                <View style={styles.imageBorder}>
                                    <Image
                                        source={{uri: this.props.teamRq.url}}
                                        style={styles.circleAvatar}
                                    />
                                </View>
                                <Text style={styles.whiteText}>{this.props.teamRq.name}</Text>
                            </View>
                        </View>
                    </View>


                </ImageBackground>
                <View style={{flex: 1, margin: 5, marginLeft: 20,}}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                        <Text style={styles.TextDeal}>
                            {"Khu vực đá : " + this.props.dealDetail.position}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={styles.TextDeal}>
                            {"Ngày :  " + this.props.dealDetail.date}</Text>
                        <Text style={styles.TextDeal}>
                            {" lúc : " + this.props.dealDetail.time1 + " - " + this.props.dealDetail.time2}</Text>
                        <Text style={styles.TextDeal}>
                            {"Sân :  " + this.props.dealDetail.pitch}</Text>
                    </View>
                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    circleAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: width(10),
        height: width(20),
        width: width(20),
    },
    imageContainer:
        {
            flex: 4,
            alignItems: 'center',
            justifyContent: 'center',
        },
    imageBorder: {
        borderRadius: width(10) + 1,
        width: width(20) + 2,
        height: width(20) + 2,
        borderWidth: 1,
        borderColor: 'white'
    },
    imageBackground:
        {
            flex: 2, flexDirection: 'row'
        },
    imageBackgroundContent:
        {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'rgba(85,85,85,0.7)'
        },
    TextDeal:
        {
            fontSize: 15,
            color: '#2c3e50',
            marginTop: 20,
            fontWeight: 'bold',
            fontFamily : TEXT_FONT_REGULAR,

        },
    whiteText :
        {
            fontSize: 30,
            color: 'white',
            fontWeight: 'bold',
            fontFamily : TEXT_FONT_REGULAR,
        }
});