import React, {Component} from 'react';
import {
    Button, Animated,
    Image,
    Platform, ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View, PermissionsAndroid, TextInput
} from 'react-native'

import {height, width} from "react-native-dimension";
import ActionButton from 'react-native-action-button';
import SlidingUpPanel from "rn-sliding-up-panel";
import MapView, {AnimatedRegion, Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DealDetailsMiniView from "./DealDetailsMiniView";
import {Icon} from "react-native-elements";
import DealMarker from "./DealMarker";
import globalStore from "../../global";
import FilterSlidingUp from "../FilterSlidingUp";
import {tabNavigatorHeight} from "../../Screen/Home/BottomNavigationTab";
import DealSlidingUp from "../DealSlidingUp";
import ConfirmDialog from "react-native-simple-dialogs/src/ConfirmDialog";
import {showLocation} from "react-native-map-link";


const ASPECT_RATIO = width(100) / height(100)
const LATITUDE = 10.8105831
const LONGITUDE = 106.7091422
const LATITUDE_DELTA = 0.0922 * 0.1
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO


const mapStyle = [
    {
        "featureType": "poi.attraction",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.government",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.place_of_worship",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.school",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#1dc925"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.station.bus",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

export default class MapDeal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deals: globalStore.getStateOf('List').dataSource,
            dealFilter: globalStore.getStateOf('List').dataSource,
            visible: false,
            draggable: true,
            type: 'Tất cả',
            age: 'Tất cả',
            district: 'Tất cả',
            myCoordinate:
                {
                    latitude: 0,
                    longitude: 0,
                },
            draggableMap: false,
            visibleMap: false,
            maxtop: false,
            place: "",
            showDetail: false,
            currentUser:
                {
                    id: '',
                    name: '',
                    type: "",
                    date: "",
                    time1: "",
                    time2: "",
                    url: "",
                    position: "",
                    phone: '',
                    mail: '',
                    about: '',
                },
            mapRegion:
                {
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                },
            myCoordinate:
                {
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                },
            mapDelta:
                {
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                },
            markerSize: 60,
            markers: [],
            confirmVisible: false,
        }
        ;
        this.onFilterSlidingRequestClose = this.onFilterSlidingRequestClose.bind(this);
        globalStore.register('Map',
            (s) => this.setState(s),
            () => {
                return this.state
            });
        globalStore.setStateOf('Home', {mapLoaded: true});
    }

    onFilterSlidingRequestClose() {
        this.setState({visible: false});
    }

    onFilterChange(teamType, age, district) {
        let _result = [];
        if (teamType !== 'Tất cả') {
            this.state.deals.map(user => {
                if (user.type === teamType || user.type === 'Tất cả') {

                    _result.push(user);
                }
            })
        }
        else {
            _result = this.state.deals.slice();
        }
        var _result2 = _result.slice();
        if (age !== 'Tất cả') {
            _result.map(user => {
                if (user.age !== age && user.age !== 'Tất cả') {
                    _result2.pop(user);
                }
            })
        }
        var _result3 = _result2.slice();
        if (district !== 'Tất cả') {
            _result2.map(user => {
                if (user.position !== district && user.position !== 'Tất cả') {
                    _result3.pop(user);
                }
            })
        }

        this.setState({dealFilter: _result3})
    };

    hasLocationPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version < 26) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAnWillid.RESULTS.DENIED) {
            ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }

        return false;
    }


    componentWillMount() {

        const hasLocationPermission = this.hasLocationPermission();

        if (!hasLocationPermission) return;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude)
                var long = parseFloat(position.coords.longitude)
                // Create the object to update this.state.mapRegion through the onRegionChange function
                let region = {
                    latitude: lat,
                    longitude: long,
                }
                this.setState({myCoordinate: region, mapRegion: region});
            },
            (error) => {
                // See error code charts below.
            }, {enableHighAccuracy: false, timeout: 25000}
        );
    }

    componentDidMount() {
    }

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
                if (responseJson === 'ERROR!')
                    this.setState({message: 'Hãy tạo đội để gửi yêu cầu'})
            }).catch((error) => {
            this.setState({message: 'Bạn đã gửi yêu cầu rồi'});
        });
        this.setState({confirmVisible: true});


    };

    render() {
        return (
            <View style={styles.container}>
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
                <View style={{position: 'absolute'}}>
                    <MapView
                        ref={ref => this.mapRef = ref}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        customMapStyle={mapStyle}
                        loadingEnabled={true}
                        //mapPadding={{top:50,left:50,right:50,bottom:50}}
                        initialRegion={{
                            latitude: this.state.myCoordinate.latitude,
                            longitude: this.state.myCoordinate.longitude,
                            latitudeDelta: this.state.mapDelta.latitudeDelta,
                            longitudeDelta: this.state.mapDelta.longitudeDelta
                        }}
                        onRegionChangeComplete={region => {
                            if (region.latitudeDelta > LATITUDE_DELTA * 0.3) {
                                this.setState({
                                    mapRegion: {
                                        latitude: region.latitude,
                                        longitude: region.longitude
                                    },
                                    mapDelta: {
                                        latitudeDelta: region.latitudeDelta,
                                        longitudeDelta: region.longitudeDelta
                                    }
                                });

                                //   console.log(region.longitude);
                            }
                        }}

                    >

                        {
                            this.state.dealFilter.map(deal => (
                                    <DealMarker
                                        color={deal.state==="1"?"red":"green"}
                                        key={deal.id}
                                        deal={deal}
                                        onPressed={() => {
                                            this.setState({ visibleMap: true,currentUser: deal });

                                            axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + deal.latitude + ',' + deal.longitude + '&key=AIzaSyC-H415RwIwooot2IeOqn9SsX1jEof8QxA') // be sure your api key is correct and has access to the geocode api
                                                .then(response => {
                                                    let address = response.data.results[0].formatted_address.toString().split(/,/);

                                                    this.setState({place: (address[0] + "," + address[1] + "," + address[2])}); // access from response.data.results[0].formatted_address
                                                }).catch((error) => { // catch is called after then

                                            });
                                        }}
                                    />
                                )
                            )
                        }
                        <Marker

                            anchor={{x: 0.5, y: 0.5}}
                            coordinate={{
                                latitude: this.state.myCoordinate.latitude,
                                longitude: this.state.myCoordinate.longitude
                            }}>
                            <View style={{
                                height: this.state.markerSize,
                                width: this.state.markerSize,
                                borderRadius: this.state.markerSize / 2,
                                borderWidth: 3,
                                borderColor: 'rgba(0,122,255,0.4)',
                                overflow: 'hidden',
                                backgroundColor: 'rgba(0,122,255,0.2)',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <View style={styles.marker}/>
                            </View>
                        </Marker>
                    </MapView>
                    <DealSlidingUp visible={this.state.visibleMap}
                                   deal={this.state.currentUser}
                                   onViewTeamPress={() => {
                                       this.props.navigation.navigate('TeamProfile', {
                                           Id: this.state.currentUser.id
                                       });
                                   }}
                                   onDraggButtonPress={() => {
                                       this.setState({visibleMap: false});
                                   }}
                                   onConfirmMakeDealPress={() => {
                                       this.SendRequest();
                                   }}
                        // onDrag={(value)=>{if (value>60){this.setState({visibleMap:false})}}}
                                   onRequestClose={()=>{this.setState({visibleMap:false})}}

                                   draggableRange={{top: tabNavigatorHeight + 250, bottom: tabNavigatorHeight+20}}
                    />
                    <View style={{
                        backgroundColor: 'rgba(255,255,255 ,0.95)',
                        flexDirection: 'row',
                        height: height(7),
                        margin: height(2),
                        borderRadius: 5,
                        marginTop: -height(90) + height(2),

                    }}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{margin: 1, borderRightWidth: 1, borderColor: 'grey'}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        showLocation({latitude: this.state.myCoordinate.latitude, longitude: this.state.myCoordinate.longitude});
                                    }}>
                                    <View style={{marginRight: 5}}>
                                        <FontAwesome name="search" size={height(3)} color="#4CAF50"/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex: 5, justifyContent: 'center'}}>
                            <TextInput editable={false} maxLength={100} multiline={false}
                                       placeholder={""} spellcheck={false}
                                       placeholderTextColor={'#9E9E9E'} underlineColorAndroid={'transparent'}
                                       autoFocus={false}>
                                {this.state.place}
                            </TextInput>
                        </View>

                        <View style={{flex: 1}}>

                        </View>
                    </View>
                    <View style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: width(6.5),
                        width: width(13),
                        height: width(13),
                        marginLeft: width(5),
                        marginTop: width(7.5),
                    }}/>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: width(6.5),
                            backgroundColor: 'white',
                            width: width(13),
                            height: width(13),
                            marginLeft: width(5) - 3,
                            marginTop: -width(13) - 1
                        }}
                        onPress={() => {
                            this.mapRef.animateToCoordinate({
                                latitude: this.state.myCoordinate.latitude,
                                longitude: this.state.myCoordinate.longitude
                            }, 500);
                        }}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <MaterialIcons name="my-location" size={width(4)} color="#4CAF50"/>
                        </View>
                    </TouchableOpacity>

                </View>
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: width(6.5),
                    width: width(13),
                    height: width(13),
                    marginTop: (height(10) + width(24)),
                    marginLeft: width(5)
                }}/>
                <View style={{height: height(100), marginTop: -width(13) - 1}}>
                    <ActionButton buttonColor="rgba(255,255,255,1)"
                                  buttonTextStyle={{color: 'black'}}
                                  verticalOrientation={"down"}
                                  position={'left'}
                                  size={width(13)}
                                  offsetX={width(5) - 3}
                                  offsetY={0}
                                  spacing={5}
                                  degrees={0}
                                  renderIcon={active => active == false ? (
                                      <MaterialCommunityIcons name={"menu"} size={width(5)} color="#4CAF50"/>) : (
                                      <FontAwesome name={"close"} size={width(5)} color="#4CAF50"/>)}>
                        <ActionButton.Item
                            offsetX={width(5)}
                            title={"Lọc"}
                            spaceBetween={5}
                            onPress={() => this.setState({visible: true})}>
                            <FontAwesome name="sliders" color="#4CAF50" size={width(5.2)}/>
                        </ActionButton.Item>
                    </ActionButton>
                </View>
                <FilterSlidingUp
                    visible={this.state.visible}
                    onRequestClose={()=>{this.setState({visibleMap:false})}}
                    draggableRange={{top: 250 + tabNavigatorHeight, bottom: tabNavigatorHeight}}
                    onFilterChange={(teamType, age, district) => {
                        this.onFilterChange(teamType, age, district)
                    }}
                />
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
            marginBottom: 0,
            height: height(90),
        },
        map: {
            flex: 1,
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: width(100),
            height: height(90),
        },
        text: {
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 10,
            marginBottom: 10,
        },
        shadowStyle: {
            backgroundColor: 'rgba(255,255,255, 0.9)',
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#000',
            borderBottomWidth: 0,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.8,
            shadowRadius: 1,
            elevation: 4,
            alignItems: 'center',
        },
        marker:
            {
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 3,
                borderColor: 'white',
                overflow: 'hidden',
                backgroundColor: '#007AFF'
            },

    }
);