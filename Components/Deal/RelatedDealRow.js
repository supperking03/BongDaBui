import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground} from 'react-native'
import {
    BACKGROUND_COLOR, BACKGROUND_COLOR_TWO, BORDER_COLOR_REGULAR, CONTENT_COLOR, CONTENT_COLOR_TWO,
    PRIMARY_COLOR_TWO
} from "../../styles/color";
import {CONTENT_TEXT_STYLES, CRUCIAL_TEXT_STYLES, SUB_TEXT_STYLES, TEXT_FONT_REGULAR} from "../../styles/text";
import {showLocation} from 'react-native-map-link'
import {getDayOfWeek} from "../../ultils/getDayOfWeek";
import {height, width} from "react-native-dimension";


export class RelatedDealRow extends Component {

    render() {
        {
            const {rowData, onPress} = this.props;
            const dateArray = rowData.date.split('/');
            const date = new Date(dateArray[2], dateArray[1], dateArray[0]);
            console.log("Deal");
            console.log(rowData);
            return (

                <TouchableOpacity style={styles.container} onPress={() => {
                    onPress(rowData);
                }}>
                    <View style={styles.header}>

                        <View style={styles.leftTeamHeaderContainer}>
                            <Text
                                style={[styles.nameText, {width: width(30), textAlign: 'right'}]}>{rowData.name}</Text>
                            <Image style={styles.image} source={{uri: rowData.url}}/>
                        </View>

                        <Text style={styles.vsText}>VS</Text>

                        <View style={styles.rightTeamHeaderContainer}>
                            <Image style={styles.image}
                                   source={{uri: (rowData.id === rowData.userId || rowData.state === '0') ? 'https://vignette.wikia.nocookie.net/joke-battles/images/5/5a/Black.jpg/revision/latest/scale-to-width-down/400?cb=20161223050425' : rowData.urlRq}}/>
                            <Text style={[styles.nameText, {
                                width: width(30),
                                textAlign: 'left'
                            }]}>{(rowData.id === rowData.userId || rowData.state === '0') ? 'N/A' : rowData.nameRq}</Text>
                        </View>
                    </View>

                    <View style={styles.body}>
                        <Text style={styles.dataText}>{getDayOfWeek(rowData.date) + ", " + rowData.date}</Text>
                        <Text style={styles.dataText}>{rowData.time1} - {rowData.time2}</Text>

                    </View>

                    <View style={styles.body}>
                        <Text style={styles.dataText}>Sân: {rowData.pitch}</Text>
                    </View>

                    <View style={styles.tail}>
                        <Text style={styles.stateText}>Trạng
                            thái: {rowData.state === '0' ? "Đang chờ" : "Đã xác nhận"}</Text>

                        {
                            (rowData.state !== '0' ) ? <View/> :
                                <TouchableOpacity   onPress={() => {
                                    this.props.onDeleteDealPress();
                                }}>
                                    <Text style={styles.mapText}>Xoá kèo của tôi</Text>
                                </TouchableOpacity>
                        }

                        <TouchableOpacity onPress={() => {
                            showLocation({latitude: rowData.latitude, longitude: rowData.longitude,});
                        }}>
                            <Text style={styles.mapText}>Xem bản đồ</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>)
        }
    }

}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 2.5,
        borderTopWidth: 2,
        backgroundColor: 'white',
        margin: 2,
        borderRadius: 2,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: BORDER_COLOR_REGULAR
    },
    image: {
        height: '100%',
        aspectRatio: 1,
        borderRadius: 100,
        margin: 5,
        borderColor: 'white'
    },
    vsText: {alignSelf: 'center',color: BACKGROUND_COLOR_TWO , fontFamily : TEXT_FONT_REGULAR,fontWeight :'bold'},
    nameText: {...StyleSheet.flatten(SUB_TEXT_STYLES.WHITE_COLOR), ...{alignSelf: 'center', margin: 5}},
    header: {flex: 2, flexDirection: 'row', backgroundColor:PRIMARY_COLOR_TWO, padding: 5},

    leftTeamHeaderContainer: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: width(30),
    },

    rightTeamHeaderContainer: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: width(30)
    },
    body: {
        flexDirection: 'row',
        flex: 1,
    },

    mapText: {
        ...StyleSheet.flatten(CONTENT_TEXT_STYLES.CONTENT_COLOR),
        ...{
            marginLeft: 10,
            marginRight: 10,
            color: 'blue',
            textDecorationLine: 'underline'
        }
    }, tail: {flexDirection: 'row', justifyContent: 'space-between', marginRight: 5, marginLeft: 5},
    dataText: {...StyleSheet.flatten(CONTENT_TEXT_STYLES.CONTENT_COLOR_TWO), ...{marginLeft: 10, marginRight: 10},...{fontFamily : TEXT_FONT_REGULAR}},
    stateText: {...StyleSheet.flatten(SUB_TEXT_STYLES.CONTENT_COLOR),...{fontFamily : TEXT_FONT_REGULAR,color:CONTENT_COLOR_TWO}}
});