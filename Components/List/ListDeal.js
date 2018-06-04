import React, {Component} from 'react'
import {Text, View, TouchableOpacity, ListView, Image, StyleSheet, TextInput, ScrollView} from 'react-native'
import Accordion from 'react-native-collapsible/Accordion';
import {height, width} from "react-native-dimension";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';
import call from "react-native-phone-call";
import globalStore from "../../global";
import DealsListView from "./DealsListView";
import ConfirmDialog from "react-native-simple-dialogs/src/ConfirmDialog";
import {tabNavigatorHeight} from "../../Screen/Home/BottomNavigationTab";
import FilterSlidingUp from "../FilterSlidingUp";
import {Icon} from "react-native-elements";

export default class ListDeal extends Component {


    constructor(props) {
        super(props);


        this.state = {
            dataSource: [],
            filterData: [],

            selectedItems: [],
            selectedAmountFilter: 'All',
            selectedAgeFilter: 'All',
            selectedDistrictFilter: 'All',


            dialogVisible: false,
            confirmVisible: false,
            message: "",
            section :{},
            visible : false,
            _scroll : null,
        };

        globalStore.register('List',
            (s) => this.setState(s),
            () => {
                return this.state
            });
        this.onFilterSlidingRequestClose=this.onFilterSlidingRequestClose.bind(this);

    }

    SendRequest = () => {

        fetch('http://71dongkhoi.esy.es/submit_dealRequest.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.section.adminId,
                userId: globalStore.getStateOf('Login').loginId,
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

    onFilterSlidingRequestClose()
    {
        this.setState({visible : false});
    }
    onFilterChange(teamType, age, district)
    {
        let _result = [];
        if (teamType !== 'Tất cả') {
            this.state.dataSource.map(user => {
                if (user.type === teamType || user.type === 'Tất cả') {

                    _result.push(user);
                }
            })
        }
        else {
            _result = this.state.dataSource.slice();
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

        this.setState({filterData: _result3})
    };


    render() {
        const {selectedItems} = this.state.selectedItems;
        return (
            <View style={{flex: 1, width: width(100), height: height(90), marginBottom: 0}}>
                <View style={{
                    backgroundColor: 'rgba(255,255,255 ,0.95)',
                    flexDirection: 'row',
                    height: height(7),
                    margin: height(2),
                    borderRadius: 5,
                }}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{margin: 1, borderRightWidth: 1, borderColor: 'grey'}}>
                            <TouchableOpacity
                                onPress={()=>this.setState({visible : true})}
                            ><View style={{marginRight: 5}}>
                                <Icon name="filter-list" size={height(3)} color="#4CAF50"/>
                            </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 5, justifyContent: 'center'}}>
                        <TextInput editable={false} maxLength={100} multiline={false}
                                   placeholder={"Lọc kèo"} spellcheck={false}
                                   placeholderTextColor={'#9E9E9E'} underlineColorAndroid={'transparent'}
                                   autoFocus={false}>
                            {this.state.place}
                        </TextInput>
                    </View>

                    <View style={{flex: 1}}>

                    </View>
                </View>
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
                <ScrollView
                    ref={ref =>this.state._scroll=ref}>
                    <DealsListView
                        deals={this.state.filterData}
                        onViewTeamPress={(section ) => {
                        this.props.navigation.navigate('TeamProfile', {
                            Id: section.adminId,
                        });
                    }}
                        onMakeDealPress={(section ) => {
                            this.setState({dialogVisible: true, section : section});
                    }}
                        onCallPress={(section ) =>
                        {
                            call({number: section.phone, prompt: false}).catch(console.error);
                        }}
                    />
                </ScrollView>
                <FilterSlidingUp
                    visible={this.state.visible}
                    onRequestClose={this.onFilterSlidingRequestClose}
                    draggableRange={{top : 250 + tabNavigatorHeight, bottom :tabNavigatorHeight}}
                    onFilterChange={(teamType , age , district) =>{
                        this.onFilterChange(teamType,age,district)
                    }}
                />
            </View>
        )
    }

}


const styles = StyleSheet.create({
    modal: {
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        height: 30,
        width: width(33),
        // borderWidth:2,
        // borderColor:'#16a085'
    },

    modalbtnText: {},
    dropdownstyle: {
        width: width(30),
        backgroundColor: 'white',
        alignSelf: 'flex-end'
    }
});


const filterType = {
    district: ['All', 'District 1', 'District 2', 'District 3', 'District 4', 'District 5', 'District 6', 'District 7', 'District 8', 'District 9', 'District 10', 'District 11', 'District 12', 'Bình Tân District', 'Bình Thạnh District', 'Gò Vấp District', 'Phú Nhuận District', 'Tân Bình District', 'Tân Phú District', 'Thủ Đức District'],
    amount: ['All', '5', '10'],
    age: ['All', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
};