import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types'
import ModalDropdown from "react-native-modal-dropdown";
import filterOptions from '../ultils/filterOptions'
import SlidingUpPanel from 'rn-sliding-up-panel';
import {CONTENT_TEXT_STYLES, SUB_TEXT_STYLES} from "../styles/text";
import {BACKGROUND_COLOR, BACKGROUND_COLOR_TWO} from "../styles/color";

const propTypes = ({
    style: PropTypes.any,
    onFilterChange: PropTypes.func,
    onTeamTypeFilterChange: PropTypes.func,
    onAgeFilterChange: PropTypes.func,
    onDistrictFilterChange: PropTypes.func,
    onDraggableChange: PropTypes.func,
    onRequestClose: PropTypes.func,
    showBackdrop: PropTypes.bool,
    visible: PropTypes.bool,
    onDrag:PropTypes.func,
    draggableRange: PropTypes.shape({
        top: PropTypes.number,
        bottom: PropTypes.number
    }),
});

const defaultProps = {
    style: {},
    draggableRange: {top: 200, bottom: 5},
    showBackdrop: false,
    visible: true,
    onFilterChange() {
    },
    onTeamTypeFilterChange() {
    },
    onAgeFilterChange() {
    },
    onDistrictFilterChange() {
    },
    onDraggableChange() {
    },
    onRequestClose() {
    }
};


export default class FilterSlidingUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamType: 'Tất cả',
            age: 'Tất cả',
            district: 'Tất cả',
            draggable: false,
        };
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onTeamTypeFilterChange = this.onTeamTypeFilterChange.bind(this);
        this.onAgeFilterChange = this.onAgeFilterChange.bind(this);
        this.onDistrictFilterChange = this.onDistrictFilterChange.bind(this);
        this.onDraggableChange = this.onDraggableChange.bind(this);
        this.onRequestClose = this.onRequestClose.bind(this);
        this.onDropDownWillShow = this.onDropDownWillShow.bind(this);
        this.onDropDownWillHide = this.onDropDownWillHide.bind(this);
    };

    onTeamTypeFilterChange(teamType) {
        const {onTeamTypeFilterChange} = this.props;
        let newFilter=Object.assign({},this.state);
        newFilter.teamType=teamType;
        this.onFilterChange(newFilter);
        this.setState({teamType: teamType, draggable: true});
        this.onDraggableChange(false);
        onTeamTypeFilterChange(teamType);

    };

    onAgeFilterChange(age) {
        const {onAgeFilterChange} = this.props;
        let newFilter=Object.assign({},this.state);
        newFilter.age=age;
        this.onFilterChange(newFilter);
        this.setState({age: age, draggable: true});
        this.onDraggableChange(true);
        onAgeFilterChange(age);

    };

    onDistrictFilterChange(district) {
        const {onDistrictFilterChange} = this.props;
        let newFilter=Object.assign({},this.state);
        newFilter.district=district;
        this.onFilterChange(newFilter);
        this.setState({district: district, draggable: true});
        this.onDraggableChange(true);
        onDistrictFilterChange(district);

    }

    onFilterChange(newFilter) {
        const {onFilterChange} = this.props;
        onFilterChange(newFilter.teamType,newFilter.age,newFilter.district);
    }


    onDraggableChange(value) {
        const {onDraggableChange} = this.props;
        onDraggableChange(value);
    }

    onRequestClose() {
        const {onRequestClose} = this.props;
        onRequestClose();
    }

    onDropDownWillShow() {
        this.setState({draggable: false});
        this.onDraggableChange(false);
    }

    onDropDownWillHide() {
        this.setState({draggable: true});
        this.onDraggableChange(true);
    }


    render() {
        const {visible, draggable, draggableRange, style} = this.props;
        const containerHeight = Math.abs(draggableRange.top - draggableRange.bottom - 20);
        return (
            <SlidingUpPanel
                ref={c => this._panel = c}
                visible={visible}
                allowDragging={false}
                draggableRange={draggableRange}
                onRequestClose={() => {this.onRequestClose()}}
                showBackdrop={false}>
                <View style={[styles.container, {height: containerHeight}, style]}>
                    <TouchableOpacity
                        style={styles.slidingTitle}
                        onPress={() => {
                            this._panel.transitionTo(1);
                            this.onRequestClose();
                        }}>
                        <Text style={styles.titleText}>Ẩn bộ lọc</Text>
                    </TouchableOpacity>

                    <View style={styles.slidingContent}>
                        <View style={styles.filterContainer}>
                            <View
                                style={[styles.filterNameContainer, {backgroundColor: (this.state.teamType === 'Tất cả') ? BACKGROUND_COLOR : BACKGROUND_COLOR_TWO}]}>
                                <Text style={styles.filterNameText}>Loại đội : </Text>
                            </View>

                            <ModalDropdown
                                style={styles.modal}
                                options={filterOptions.teamType}
                                dropdownStyle={styles.dropDownStyle}
                                dropdownTextStyle={styles.dropDownTextStyle}
                                onDropdownWillShow={() => this.onDropDownWillShow}
                                onDropdownWillHide={() => this.onDropDownWillHide}
                                onSelect={(idx, teamType) => {
                                    this.onTeamTypeFilterChange(teamType);
                                }}>
                                <Text style={styles.selectedText}>{this.state.teamType}</Text>
                            </ModalDropdown>
                        </View>


                        <View style={styles.filterContainer}>
                            <View
                                style={[styles.filterNameContainer, {backgroundColor: (this.state.age === 'Tất cả') ? BACKGROUND_COLOR : BACKGROUND_COLOR_TWO}]}>
                                <Text style={styles.filterNameText}>Age : </Text>
                            </View>
                            <ModalDropdown
                                style={styles.modal}
                                options={filterOptions.age}
                                dropdownStyle={styles.dropDownStyle}
                                dropdownTextStyle={styles.dropDownTextStyle}
                                onDropdownWillShow={() => this.onDropDownWillShow}
                                onDropdownWillHide={() => this.onDropDownWillHide}
                                onSelect={(idx, age) => {
                                    this.onAgeFilterChange(age);
                                }}
                            >
                                <Text style={styles.selectedText}>{this.state.age}</Text>
                            </ModalDropdown>
                        </View>


                        <View style={styles.filterContainer}>
                            <View
                                style={[styles.filterNameContainer, {backgroundColor: (this.state.district === 'Tất cả') ?BACKGROUND_COLOR :BACKGROUND_COLOR_TWO}]}>
                                <Text style={styles.filterNameText}>District : </Text>
                            </View>

                            <ModalDropdown
                                style={styles.modal}
                                options={filterOptions.district}
                                dropdownStyle={styles.dropDownStyle}
                                dropdownTextStyle={styles.dropDownTextStyle}
                                onDropdownWillShow={() => this.onDropDownWillShow}
                                onDropdownWillHide={() => this.onDropDownWillHide}
                                onSelect={(idx, district) => {
                                    this.onDistrictFilterChange(district);
                                }}>
                                <Text style={styles.selectedText}>{this.state.district}</Text>
                            </ModalDropdown>
                        </View>
                    </View>
                </View>
            </SlidingUpPanel>
        );
    }
}

FilterSlidingUp.propTypes = propTypes;
FilterSlidingUp.defaultProps = defaultProps;


const styles = StyleSheet.create({
        container: {width: '100%', height: 200, borderRadius: 5, elevation: 10, backgroundColor: 'white' ,borderColor : 'black', borderWidth: 2},

        slidingTitle: {justifyContent: 'center', width: '100%', alignItems: 'center'},

        titleText: StyleSheet.flatten(SUB_TEXT_STYLES.CONTENT_COLOR),

        slidingContent: {flex: 1},

        filterContainer: {flexDirection: 'row', flex: 1, justifyContent: 'space-between'},

        filterNameContainer: {borderRadius: 3, margin: 10, padding: 5, justifyContent: 'center', alignItems: 'center'},

        filterNameText: StyleSheet.flatten(CONTENT_TEXT_STYLES.CONTENT_COLOR),

        modal: {justifyContent: 'center', marginRight: 10},

        dropDownTextStyle: {fontSize: 15, textAlign: 'right'},

        dropDownStyle: {width: 100, height: 150, alignItems: 'stretch'},

        selectedText: StyleSheet.flatten(SUB_TEXT_STYLES.CONTENT_COLOR),


    }
);