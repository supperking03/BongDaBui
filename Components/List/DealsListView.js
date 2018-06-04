import React, {Component} from 'react'
import {View, StyleSheet, Alert, ScrollView} from 'react-native'
import PropTypes from 'prop-types'
import {DealsContent, DealsHeader} from './DealsRow'

import Accordion from 'react-native-collapsible/Accordion';


const propTypes = ({
    deals: PropTypes.any,
    style: PropTypes.any,
    onCallPress: PropTypes.func,
    onMakeDealPress: PropTypes.func,
    onViewTeamPress: PropTypes.func,
});

const defaultProps = {
    deals: [{url: "", name: "", teamType: "", age: "", position: "", time1: "", time2: "", dealType: "",pitch:""}],
    style: {},
    onCallPress() {
    },
    onMakeDealPress() {
    },
    onViewTeamPress() {
    }
};

export default class DealsListView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <ScrollView style={styles.scrollView}>
                    <Accordion initiallyActiveSection={null} expanded={false} activeOpacity={0.5}
                               underlayColor="#2ecc71" align="bottom"
                               sections={this.props.deals}
                               renderHeader={
                                   (section, i, isActive, sections) =>
                                       <DealsHeader section={section}/>
                               }
                               renderContent={
                                   (section, i, isActive, sections) =>
                                       <DealsContent section={section}
                                                     onCallPress={this.props.onCallPress}
                                                     onViewTeamPress={this.props.onViewTeamPress}
                                                     onMakeDealPress={this.props.onMakeDealPress}

                                       />
                               }
                    />
                </ScrollView>
            </View>
        )
    };
}


DealsListView.propTypes = propTypes;
DealsListView.defaultProps = defaultProps;

const styles = StyleSheet.create({
    container: {flex: 1,backgroundColor:'transparent'},
    scrollView:{flex:1},
});