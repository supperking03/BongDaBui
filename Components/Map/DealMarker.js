import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Image, ImageBackground} from 'react-native'
import MapView from 'react-native-maps';

const propTypes = ({
    deal: PropTypes.any,
    anchor: PropTypes.any,
    style: PropTypes.any,
    color: PropTypes.oneOf(["green", "red"]),
    visible: PropTypes.bool,
    onPress: PropTypes.func,

});

const defaultProps = {
    anchor: {x: 0.5, y: 1},
    visible: true,
    color: "green",
    deal: {
        id: "",
        url: "https://www.statbeat.com/static/images/default-team-logo-large.png",
        name: "",
        latitude: 0,
        longitude: 0,
    },
    onPress() {
    },

};

export default class ImageMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialRender: true
        };
        this.onPressed = this.onPressed.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }

    onPressed() {
        const {onPressed} = this.props;
        onPressed();
    }

    onLoad() {
        this.setState({initialRender: false});
    }

    render() {
        const {visible, deal, color, anchor} = this.props;
        return (
            <MapView.Marker
                key={deal.id}
                title={deal.name}
                onPress={this.onPressed}
                style={visible === false ? styles.hide : [styles.marker, this.props.style]}
                anchor={anchor}
                coordinate={{latitude: parseFloat(deal.latitude), longitude: parseFloat(deal.longitude)}}>
                <View style={{flex: 1}}>
                    <ImageBackground
                        style={styles.imageBackground}
                        key={`${this.state.initialRender}`}
                        onLoad={this.onLoad}
                        source={color === "green" ? require('../../assets/greenMarker.png') : require('../../assets/redMarker.png')}>
                        <Image source={{uri: deal.url}}
                               style={visible === false ? styles.hide : styles.avatar}/>
                    </ImageBackground>

                </View>
            </MapView.Marker>
        );
    }
}

ImageMarker.propTypes = propTypes;
ImageMarker.defaultProps = defaultProps;

const styles = StyleSheet.create({
    imageBackground: {

        width: '100%', height: '100%',
        alignItems: 'center'
    },
    hide: {
        width: 0,
        height: 0
    },
    marker: {
        width: 50,
        height: 50,
    },
    avatar: {
        marginTop: '10%',
        width: '60%',
        height: '60%'
    }
});