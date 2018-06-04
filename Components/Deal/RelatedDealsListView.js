import React, {Component} from 'react'
import {StyleSheet, ListView} from 'react-native'
import PropTypes from 'prop-types'

import {RelatedDealRow} from "./RelatedDealRow";


const propTypes = ({
    deals: PropTypes.any,
    style: PropTypes.any,
    onPress: PropTypes.func,
    onDeleteDealPress:PropTypes.func
});

const defaultProps = {
    deals: [{
        nameRq: "",
        pitch:"",
        urlRq: "",
        name: "",
        url: "",
        id: "",
        userId: "",
        type: "",
        date: "",
        time1: "",
        time2: "",
        latitude: "",
        longitude: "",
        age: "",
        position: "",
        dealType: "",
        state: 0//0 là đang chờ, 1 là đã kèo rồi
    }],
    style: {},
    onPress(){},
    onDeleteDealPress(){}
};

export default class RelatedDealsListView extends Component {
    constructor(props) {
        super(props);
    }

    onPress(section) {
        const {onPress} = this.props.onPress;
        onPress(section);
    }

    render() {
        console.log('source');
        console.log(this.props.deals);
        return (
            <ListView
                style={[styles.container, this.props.style]}
                dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.deals)}
                renderRow={(rowData) => <RelatedDealRow onPress={this.props.onPress} rowData={rowData}
                onDeleteDealPress={this.props.onDeleteDealPress}
                />}
            />
        )
    };
}


RelatedDealsListView.propTypes = propTypes;
RelatedDealsListView.defaultProps = defaultProps;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});