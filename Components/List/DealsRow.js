import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'

import {BACKGROUND_COLOR, BORDER_COLOR_REGULAR, PRIMARY_COLOR, PRIMARY_COLOR_TWO} from "../../styles/color";
import {CONTENT_TEXT_STYLES, SUB_TEXT_STYLES} from "../../styles/text";

const fontSize = Dimensions.get('window').width * 0.03;

export class DealsHeader extends Component {
    render() {
        const {section, index, isActive, sections} = this.props;
        if (section.state==="1")
            return (<View/>);
        return (
            <View style={headerStyles.container}>
                <View style={headerStyles.imageContainer}>
                    <Image style={headerStyles.image} source={{uri: section.url}}/>
                    <Text style={headerStyles.title}>{section.name}</Text>
                </View>
                <View style={headerStyles.infoContainer}>
                    <Text style={headerStyles.highlight}>Loại kèo: {section.dealType}</Text>
                    <Text style={headerStyles.data}>Loại đội: {section.type}</Text>
                    <Text style={headerStyles.data}>Tuổi: {section.age}</Text>
                    <Text style={headerStyles.data}>Sân: {section.pitch}</Text>
                    <Text style={headerStyles.data}>Khu vực: {section.position}</Text>
                    <Text style={headerStyles.data}>{section.date}</Text>
                    <Text style={headerStyles.data}>{section.time1 + " - " + section.time2}</Text>
                </View>
            </View>
        )
    }
}

export class DealsContent extends Component {
    render() {
        const {section, index, isActive, sections, onCallPress, onViewTeamPress, onMakeDealPress} = this.props;

        return (
            <View style={contentStyles.container}>
                <TouchableOpacity style={contentStyles.greenButton}
                                  onPress={() => {
                                      onViewTeamPress(section);
                                  }}>
                    <Text style={contentStyles.greenTitle}>Xem đội</Text>
                </TouchableOpacity>

                <TouchableOpacity style={contentStyles.greenButton}
                                  onPress={() => {
                                      onMakeDealPress(section);
                                  }}>
                    <Text style={contentStyles.greenTitle}>Mời thách đấu</Text>
                </TouchableOpacity>

                <TouchableOpacity style={contentStyles.whiteButton}
                                  onPress={() => {
                                      onCallPress(section);
                                  }}>
                    <Text style={contentStyles.whiteTitle}>Gọi</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const headerStyles = StyleSheet.create({
    container: {
        borderColor:PRIMARY_COLOR_TWO,
        borderWidth:1,
        borderRadius:5,
        flexDirection: 'row',
        width: '98%',
        aspectRatio: 2.7,
        alignSelf:'center',
        paddingBottom:'2%',
        marginTop:'1%',
        marginLeft:'1%',
        marginRight:'1%',
        elevation:10,
        backgroundColor: BACKGROUND_COLOR
    },
    imageContainer:{
        flexDirection:'column',
        flex:1
    },
    image: {
        marginTop:'5%',
        width:'90%',
        flex: 3,
        alignSelf: 'center'
    },
    infoContainer: {
        flexDirection: 'column',
        flex: 2,
        justifyContent: 'center',
        paddingLeft: '2%',
    },
    title: {
        alignSelf:'center',
        flex:1,
        fontWeight: 'bold',
        color: '#27ae60',
        fontSize: fontSize
    },
    data: {
        marginTop:'1%',
        marginLeft: '3%',
        color: '#3E4E5E',
        fontSize: fontSize,
        //textAlign:"",
    },
    highlight:{
        marginTop:'1%',
        marginLeft: '3%',
        color: '#3E4E5E',
        fontSize: fontSize,
        fontWeight:'bold'
    }
});

const contentStyles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flexDirection: 'row',
        width: '98%',
        aspectRatio: 10,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR, elevation: 5,

        paddingLeft: "4%",
        paddingRight: "4%",
        marginBottom: "1%",
    },
    greenButton: {
        borderRadius: 10, borderWidth: 2, borderColor: PRIMARY_COLOR,
        alignItems: 'center', justifyContent: 'center',
        margin: "1%", padding: "1%",
        flex: 2
    },
    whiteButton: {
        borderRadius: 10, backgroundColor: PRIMARY_COLOR,
        margin: "1%", padding: "1%",
        alignItems: 'center', justifyContent: 'center',
        flex: 1
    },
    whiteTitle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 1.2 * fontSize
    },
    greenTitle: {
        fontWeight: 'bold',
        color: '#27ae60',
        fontSize: 1.2 * fontSize
    },
});