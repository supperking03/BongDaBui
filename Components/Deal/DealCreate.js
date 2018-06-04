import React, {Component, Alert} from "react";
import {
    Button, Animated,
    Image,
    Platform, ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View, PermissionsAndroid, TextInput
} from 'react-native'
import ModalDropdown from "react-native-modal-dropdown/components/ModalDropdown";
import DatePicker from 'react-native-datepicker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {height, width} from "react-native-dimension";
import MapView, {AnimatedRegion, Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {Icon} from 'react-native-elements'
import * as axios from "axios/index";
import StepIndicator from 'react-native-step-indicator';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {ProgressDialog} from 'react-native-simple-dialogs';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import globalStore from "../../global";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const ASPECT_RATIO = width(100) / height(100);
const LATITUDE = 10.8105831;
const LONGITUDE = 106.7091422;
const LATITUDE_DELTA = 0.0922 * 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
];

export default class DealCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: globalStore.getStateOf('Login').loginId,
            type: '5 người',
            age: '21 - 25',
            district: 'Quận Phú Nhuận',
            date: new Date(),
            timeStart: new Date(0, 0, 0, new Date().getHours(), new Date().getMinutes(), 0, 0),
            timeEnd: new Date(0, 0, 0, new Date().getHours() + 1, new Date().getMinutes(), 0, 0),
            pitch: '',
            latitude: LATITUDE,
            longitude: LONGITUDE,
            myCoordinate: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
            },
            currentPosition: 0,
            mapDelta:
                {
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                },
            place: "",
            statusBarHeight: 0,
            dealType: 'Thương lượng',
            alert: "Thành công",
            alertVisible: false,
            progressVisible: false,

        }
        ;


    }

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
                this.setState({myCoordinate: region, latitude: lat, longitude: long});
            },
            (error) => {
                // See error code charts below.
            }, {enableHighAccuracy: false, timeout: 25000}
        );
    }

    BacktoMap = () => {
        this.setState({alertVisible: false});
        globalStore.getStateOf('DealManager')._this.LoadMyDeal();
        globalStore.getStateOf('DealManager')._this.LoadRelatedDeal();
        this.props.navigation.goBack();

    }

    InsertDataToServer = () => {
        const TextInputType = this.state.type;
        const TextInputAge = this.state.age;
        const TextInputDate = this.state.date.getDate() + "/" + (this.state.date.getMonth() + 1) + "/" + this.state.date.getFullYear();
        const TextInputId = this.state.id;
        const TextInputTime1 = this.state.timeStart.getHours() + ":" + this.state.timeStart.getMinutes() + ((this.state.timeStart.getHours() < 12) ? " AM" : " PM")
        const TextInputTime2 = this.state.timeEnd.getHours() + ":" + this.state.timeEnd.getMinutes() + ((this.state.timeStart.getHours() < 1) ? " AM" : " PM")
        const TextInputPosition = this.state.district;
        const TextInputLat = this.state.latitude;
        const TextInputLong = this.state.longitude;
        const dealType = this.state.dealType;

        this.setState({progressVisible: true});
        fetch('http://71dongkhoi.esy.es/submit_deal_info.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                type: TextInputType,

                id: TextInputId,

                age: TextInputAge,

                date: TextInputDate,

                time1: TextInputTime1,

                time2: TextInputTime2,

                position: TextInputPosition,

                latitude: TextInputLat,

                longitude: TextInputLong,

                dealType: dealType,

                pitch: this.state.pitch,

                dayExpired: (this.state.date.getDate() - new Date().getDate()),
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson === 'Duplicated deal !')
                    this.setState({alert: "Bạn đã có một bài đăng rồi"})
                if (responseJson === 'ERROR!')
                    this.setState({alert: 'Hãy tạo đội để gửi yêu cầu'})
                this.setState({progressVisible: false, alertVisible: true});
            }).catch((error) => {
            console.error(error);
        });


    };

    maxDate = (addition) => {
        var today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() + addition, 0, 0, 0, 0);
    }

    render() {
        return (
            <KeyboardAwareScrollView>
                <View style={{flex: 1, backgroundColor: 'white', height: height(90)}}>
                    <View style={{height: height(10), margin: width(3), marginBottom: 0}}>
                        <StepIndicator
                            stepCount={3}
                            customStyles={customStyles}
                            currentPosition={this.state.currentPosition}
                            labels={["Thêm thông tin kèo", "Tùy chọn vị trí", "Đăng tin"]}
                        />
                    </View>
                    {this.renderStep()}
                    <ConfirmDialog
                        title="Đăng bài"
                        message={this.state.alert}
                        visible={this.state.alertVisible}
                        onTouchOutside={() => this.BacktoMap()}
                        positiveButton={{
                            title: "OK",
                            onPress: () => {
                                this.BacktoMap()
                            },
                        }}
                    />
                    <ProgressDialog
                        visible={this.state.progressVisible}
                        title="Đăng bài"
                        message="Đang đăng..."
                    />
                </View>
            </KeyboardAwareScrollView>


        );
    }

    renderStep() {
        if (this.state.currentPosition === 0) {
            return (
                <View style={{flex: 1, padding: width(3)}}>
                    <View style={{flex: 0.5}}/>
                    <View style={{flex: 1}}>
                        <Text
                            style={{
                                fontSize: height(2),
                                fontWeight: 'bold',
                                marginBottom: height(1),
                            }}>Loại đội bóng :</Text>
                        <View style={{alignItems: 'center'}}>
                            <ModalDropdown
                                dropdownStyle={{
                                    width: width(80),
                                    height: height(5) * 4,
                                    alignItems: 'stretch',
                                }}
                                textStyle={{color: 'black'}}
                                dropdownTextStyle={{fontSize: height(3), textAlign: 'left', marginLeft: 20,}}
                                options={['5 người', '10 người']}
                                defaultIndex={0}
                                onSelect={(idx, type) => {
                                    this.setState({type: type})
                                }}>
                                <View style={styles.box}>
                                    <Text style={styles.text}>{this.state.type}</Text>
                                    <View style={{
                                        flex: 4,
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        marginRight: 10
                                    }}>
                                        <MaterialCommunityIcons name={"chevron-down"} size={height(3)}/>
                                    </View>
                                </View>
                            </ModalDropdown>
                        </View>

                    </View>
                    <View style={{flex: 1}}>
                        <Text
                            style={{
                                fontSize: height(2),
                                fontWeight: 'bold',
                                marginBottom: height(1),
                            }}>Độ tuổi :</Text>
                        <View style={{alignItems: 'center'}}>
                            <ModalDropdown
                                dropdownStyle={{
                                    width: width(80),
                                    height: height(5) * 4,
                                    alignItems: 'stretch',
                                }}
                                textStyle={{color: 'black'}}
                                dropdownTextStyle={{fontSize: height(3), textAlign: 'left', marginLeft: 20,}}
                                options={['10 - 16', '17 - 20', '21 - 25', '25+']}
                                defaultIndex={0}
                                onSelect={(idx, age) => {
                                    this.setState({age: age})
                                }}>
                                <View style={styles.box}>
                                    <Text style={styles.text}>{this.state.age}</Text>
                                    <View style={{
                                        flex: 4,
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        marginRight: 10
                                    }}>
                                        <MaterialCommunityIcons name={"chevron-down"} size={height(3)}/>
                                    </View>
                                </View>
                            </ModalDropdown>
                        </View>

                    </View>
                    <View style={{flex: 1}}>
                        <Text
                            style={{
                                fontSize: height(2),
                                fontWeight: 'bold',
                                marginBottom: height(1),
                            }}>Khu vực đá :</Text>
                        <View style={{alignItems: 'center'}}>
                            <ModalDropdown
                                dropdownStyle={{
                                    width: width(80),
                                    height: height(5) * 4,
                                    alignItems: 'stretch',
                                }}
                                textStyle={{color: 'black'}}
                                dropdownTextStyle={{fontSize: height(3), textAlign: 'left', marginLeft: 20}}
                                options={['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Quận Bình Tân', 'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Tân Bình', 'Quận Tân Phú', 'Quận Thủ Đức', 'Khác..']}
                                defaultIndex={0}
                                onSelect={(idx, district) => {
                                    this.setState({district: district})
                                }}>
                                <View style={
                                    styles.box
                                }>
                                    <Text style={styles.text}>{this.state.district}</Text>
                                    <View style={{
                                        flex: 4,
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        marginRight: 10
                                    }}>
                                        <MaterialCommunityIcons name={"chevron-down"} size={height(3)}/>
                                    </View>
                                </View>
                            </ModalDropdown>
                        </View>

                    </View>
                    <View style={{flex: 1}}>
                        <Text
                            style={{
                                fontSize: height(2),
                                fontWeight: 'bold',
                                marginBottom: height(1),
                            }}>Ngày :</Text>
                        <View style={{alignItems: 'center'}}>
                            <DatePicker
                                style={{
                                    backgroundColor: 'rgba(220,237,200 ,0.9)',
                                    width: width(80) - 2,
                                    height: height(5),
                                    borderRadius: 3,
                                }}
                                date={this.state.date}
                                showIcon={false}
                                mode="date"
                                format="DD-MM-YYYY"
                                minDate={new Date()}
                                maxDate={this.maxDate(7)}
                                androidMode='spinner'
                                customStyles={{
                                    dateInput:
                                        {
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                            borderColor: 'rgba(220,237,200 ,1)'
                                        },
                                    dateText:
                                        {
                                            marginLeft: 20,
                                            fontSize: height(3),
                                            marginBottom: height(1),
                                            color: 'black'
                                        },
                                    placeholderText:
                                        {
                                            marginLeft: 20,
                                            fontSize: height(3),
                                            color: 'grey'
                                        }

                                }}
                                onDateChange={(date) => {
                                    var res = date.split(/-/);
                                    this.setState({date: new Date(res[2], res[1] - 1, res[0], 0, 0, 0, 0)});

                                }}
                            />

                        </View>


                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: height(2),
                                fontWeight: 'bold',
                                marginBottom: height(1),
                            }}>Thời gian :</Text>
                        <View style={{alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', width: width(80) - 2}}>
                                <View style={{flexDirection: 'row', width: width(40) - 1}}>
                                    <Text
                                        style={{
                                            width: width(10),
                                            fontSize: height(2),
                                        }}>Từ:</Text>
                                    <DatePicker
                                        style={{
                                            backgroundColor: 'rgba(220,237,200 ,0.9)',
                                            width: width(30) - 1,
                                            height: height(5),
                                            borderRadius: 3,
                                        }}
                                        date={this.state.timeStart}
                                        showIcon={false}
                                        mode='time'
                                        androidMode='spinner'
                                        format="HH:mm a"
                                        minuteInterval={30}
                                        minTime={new Date()}
                                        customStyles={{
                                            dateInput:
                                                {
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'center',
                                                    borderColor: 'rgba(220,237,200 ,1)'
                                                },
                                            dateText:
                                                {
                                                    marginLeft: 20,
                                                    fontSize: 15,
                                                    marginBottom: height(1),
                                                    color: 'black'
                                                },
                                            placeholderText:
                                                {
                                                    marginLeft: 20,
                                                    fontSize: 15,
                                                    color: 'grey'
                                                }

                                        }}
                                        onDateChange={(time) => {
                                            var first = time.split(/:/);
                                            var second = first[1].split(/ /);
                                            this.setState({timeStart: new Date(0, 0, 0, Number(first[0]), Number(second[0]), 0, 0, 0)});
                                            (1 * (this.state.timeStart) > 1 * (this.state.timeEnd)) ? this.setState({timeEnd: new Date(0, 0, 0, Number(first[0]), Number(second[0]), 0, 0, 0)}) : null;
                                        }}
                                    />
                                </View>
                                <View style={{width: width(3)}}/>
                                <View style={{flexDirection: 'row', width: width(37) - 1}}>
                                    <Text
                                        style={{
                                            width: width(7),
                                            fontSize: height(2),
                                        }}>Đến:</Text>
                                    <DatePicker
                                        style={{
                                            backgroundColor: 'rgba(220,237,200 ,0.9)',
                                            width: width(30) - 1,
                                            height: height(5),
                                            borderRadius: 3,
                                            borderColor: 'black',
                                        }}
                                        date={this.state.timeEnd}
                                        minTime={this.state.timeStart}
                                        minuteInterval={10}
                                        showIcon={false}
                                        mode='time'
                                        androidMode='spinner'
                                        format="HH:mm a"
                                        customStyles={{
                                            dateInput:
                                                {
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'center',
                                                    borderColor: 'rgba(220,237,200 ,1)'
                                                },
                                            dateText:
                                                {
                                                    marginLeft: 20,
                                                    fontSize: 15,
                                                    marginBottom: height(1),
                                                    color: 'black'
                                                },
                                            placeholderText:
                                                {
                                                    marginLeft: 20,
                                                    fontSize: 15,
                                                    color: 'grey'
                                                }

                                        }}
                                        onDateChange={(time) => {
                                            var first = time.split(/:/);
                                            var second = first[1].split(/ /);
                                            this.setState({timeEnd: new Date(0, 0, 0, Number(first[0]), Number(second[0]), 0, 0, 0)});
                                        }}
                                    />
                                </View>

                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1}}/>
                    <View style={{flex: 0.5, alignItems: 'center'}}>
                        <View style={{
                            height: 30,
                            flexDirection: 'row',
                            width: width(80),
                            justifyContent: 'space-between',
                        }}>
                            <TouchableOpacity
                                onPress={this.BacktoMap}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#16a085',
                                    borderRadius: 15,
                                }}>
                                <View style={{width: width(30), flexDirection: 'row', justifyContent: 'center'}}>
                                    <MaterialCommunityIcons size={22} name="chevron-left" color="white"/>
                                    <Text style={{
                                        color: 'white',
                                        marginRight: width(15) - 40,
                                        fontWeight: 'bold',
                                        fontSize: 18
                                    }}>Trở về</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({currentPosition: 1})
                                }}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#16a085',
                                    borderRadius: 15,
                                }}>
                                <View
                                    style={{width: width(30), flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        marginLeft: width(15) - 40,
                                        fontSize: 18
                                    }}>Tiếp</Text>
                                    <MaterialCommunityIcons size={22} name="chevron-right" color="white"/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            );
        }
        if (this.state.currentPosition === 1) {
            return (
                <View style={styles.container}>
                    <View stye={{position: 'absolute'}}>
                        <MapView
                            style={styles.map}
                            ref={c => this.mapRef = c}
                            customMapStyle={mapStyle}
                            showsMyLocationButton={true}
                            loadingEnabled={true}
                            initialRegion={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                latitudeDelta: this.state.mapDelta.latitudeDelta,
                                longitudeDelta: this.state.mapDelta.longitudeDelta
                            }}
                            onRegionChangeComplete={region => {
                                axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + region.latitude + ',' + region.longitude + '&key=AIzaSyC-H415RwIwooot2IeOqn9SsX1jEof8QxA') // be sure your api key is correct and has access to the geocode api
                                    .then(response => {
                                        var address = response.data.results[0].formatted_address.toString().split(/,/);

                                        this.setState({place: (address[0] + "," + address[2])}); // access from response.data.results[0].formatted_address
                                    }).catch((error) => { // catch is called after then
                                    //alert("Eeeeeee");
                                });
                                this.setState({latitude: region.latitude, longitude: region.longitude});
                            }}
                        >
                        </MapView>

                    </View>
                    <View style={{
                        backgroundColor: 'rgba(255,255,255 ,0.85)',
                        height: height(10),
                        margin: height(2),
                        borderRadius: 5,
                        marginTop: -height(74) + height(2),
                        alignItems: 'center'
                    }}>
                        <View style={{flex: 1, marginLeft: width(5)}}>
                            <View style={{flex: 2, justifyContent: 'center'}}>
                                <View style={{flex: 1}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                        <Text style={{fontSize: 17, color: '#2c3e50', marginTop: 10}}>
                                            {"Vị trí của bạn : " + this.state.place}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: width(5),
                        width: width(10),
                        height: width(10),
                        marginLeft: width(5),
                        marginTop: width(7.5),
                    }}/>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: width(5),
                            backgroundColor: 'white',
                            width: width(10),
                            height: width(10),
                            marginLeft: width(5) - 3,
                            marginTop: -width(10) - 1,
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
                    <TouchableOpacity
                        style={{width: 32, height: 58, marginLeft: width(50), marginTop: height(20) - 58}}
                        onPress={() => {
                            this.setState({currentPosition: 2})
                        }}>
                        <Image source={require('../../assets/pin.png')}>
                        </Image>
                    </TouchableOpacity>
                    <View style={{marginTop: height(20), alignItems: 'center'}}>
                        <View style={{
                            height: 30,
                            flexDirection: 'row',
                            width: width(80),
                            justifyContent: 'space-between',
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({currentPosition: 0})
                                }}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#16a085',
                                    borderRadius: 15,
                                }}>
                                <View style={{width: width(30), flexDirection: 'row', justifyContent: 'center'}}>
                                    <MaterialCommunityIcons size={22} name="chevron-left" color="white"/>
                                    <Text style={{
                                        color: 'white',
                                        marginRight: width(15) - 40,
                                        fontWeight: 'bold',
                                        fontSize: 18
                                    }}>Quay lại</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({currentPosition: 2})
                                }}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#16a085',
                                    borderRadius: 15,
                                }}>
                                <View
                                    style={{width: width(30), flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        marginLeft: width(15) - 40,
                                        fontSize: 18
                                    }}>Tiếp</Text>
                                    <MaterialCommunityIcons size={22} name="chevron-right" color="white"/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }
        if (this.state.currentPosition === 2) {
            return (
                <View style={styles.container}>
                    <View style={{
                        backgroundColor: 'rgba(255,255,255 ,1)',
                        height: height(90),
                        margin: height(2),
                        borderRadius: 5,
                        marginTop: height(10),
                        alignItems: 'center'
                    }}>
                        <View style={{position: 'absolute', width: width(90)}}>
                            <View style={{flex: 3}}>
                                <Text style={{fontSize: 15, color: '#2c3e50', fontWeight: 'bold', marginTop: 10,}}>
                                    {"Loại đội bóng : " + this.state.type}</Text>
                                <Text style={{fontSize: 15, color: '#2c3e50', marginTop: 10,}}>
                                    {"Độ tuổi : " + this.state.age}</Text>
                                <View style={{flexDirection: 'column'}}>
                                    <Text style={{fontSize: 15, color: '#2c3e50', marginTop: 10,}}>
                                        {"Ngày :  " + this.state.date.getDate() + "/" + this.state.date.getMonth() + "/" + this.state.date.getFullYear()}</Text>
                                    <Text style={{fontSize: 15, color: '#2c3e50', marginTop: 10, marginLeft: 10}}>
                                        {" lúc : " + this.state.timeStart.getHours() + ":" + this.state.timeStart.getMinutes() + ((this.state.timeStart.getHours() < 12) ? " AM" : " PM") + " - " + this.state.timeEnd.getHours() + ":" + this.state.timeEnd.getMinutes() + ((this.state.timeStart.getHours() < 1) ? " AM" : " PM")}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                    <Text style={{fontSize: 15, color: '#2c3e50', marginTop: 10,}}>
                                        {"Khu vực đá : " + this.state.district}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                    <Text style={{fontSize: 15, color: '#2c3e50', marginTop: 10,}}>
                                        {"Vị trí gặp : "}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                    <Text style={{fontSize: 15, color: '#2c3e50', marginTop: 10, marginLeft: 20}}>
                                        {"  " + this.state.place}</Text>
                                </View>
                            </View>
                            <View style={{flex: 1}}>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: 'bold',
                                        marginBottom: height(1),
                                    }}>Loại kèo :</Text>
                                <View style={{alignItems: 'center'}}>
                                    <ModalDropdown
                                        dropdownStyle={{
                                            height: height(5) * 4,
                                            width: width(70),
                                            alignItems: 'stretch',
                                        }}
                                        textStyle={{color: 'black'}}
                                        dropdownTextStyle={{fontSize: 17, textAlign: 'left', marginLeft: 20,}}
                                        options={['Thương lượng', '5:5', '6:4', '7:3', 'Nước']}
                                        defaultIndex={0}
                                        onSelect={(idx, type) => {
                                            this.setState({dealType: type})
                                        }}>
                                        <View style={styles.box}>
                                            <Text style={styles.text}>{this.state.dealType}</Text>
                                            <View style={{
                                                flex: 4,
                                                alignItems: 'flex-end',
                                                justifyContent: 'center',
                                                marginRight: 10
                                            }}>
                                                <MaterialCommunityIcons name={"chevron-down"} size={height(3)}/>
                                            </View>
                                        </View>
                                    </ModalDropdown>
                                </View>

                            </View>
                            <View style={{flex: 1}}>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: 'bold',
                                        marginBottom: height(1),
                                    }}>Sân muốn dá (Nếu có) :</Text>
                                <View style={{alignItems: 'center'}}>
                                    <TextInput
                                        placeholder="Sân muốn đá"
                                        value={this.state.pitch}
                                        onChangeText={pitch => this.setState({
                                            pitch: pitch
                                        })}
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='#bdc3c7'
                                        style={styles.TextInputStyleClass}/>
                                </View>

                            </View>

                            <View style={{marginTop: height(3), alignItems: 'center', flex: 1}}>
                                <View style={{
                                    height: 40,
                                    flexDirection: 'row',
                                    width: width(80),
                                    justifyContent: 'space-between',
                                }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({currentPosition: 1})
                                        }}
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#16a085',
                                            borderRadius: 15,
                                        }}>
                                        <View
                                            style={{width: width(30), flexDirection: 'row', justifyContent: 'center'}}>
                                            <MaterialCommunityIcons size={22} name="chevron-left" color="white"/>
                                            <Text style={{
                                                color: 'white',
                                                marginRight: width(15) - 40,
                                                fontWeight: 'bold',
                                                fontSize: 18
                                            }}> Quay lại </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this.InsertDataToServer}
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#16a085',
                                            borderRadius: 15,
                                        }}>
                                        <View style={{
                                            width: width(30),
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <FontAwesome size={20} name="newspaper-o" color="white"/>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 18,
                                            }}> Đăng bài </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
            );

        }
        return;
    }
}
const customStyles = {
    stepIndicatorSize: 45,
    currentStepIndicatorSize: 55,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#16a085',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#1abc9c',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#1abc9c',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#1abc9c',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#16a085',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#ffffff',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#2c3e50'
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: height(80)
    },
    map: {
        marginTop: height(4),
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: width(100),
        height: height(74),
        zIndex: -1,
        paddingRight: width(90),
        paddingTop: height(25)
    },
    text:
        {
            flex: 4,
            marginLeft: 20,
            fontSize: 17,
            color: 'black'
        },
    box:
        {
            width: width(80) - 2,
            backgroundColor: 'rgba(220,237,200 ,0.9)',
            height: height(5),
            borderWidth: 1,
            borderRadius: 3,
            borderColor: 'rgba(220,237,200 ,1)',
            flexDirection: 'row',

        },
    TextInputStyleClass: {
        fontSize: 15,
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