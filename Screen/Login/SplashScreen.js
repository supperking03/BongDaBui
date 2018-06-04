import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, Animated, Image, Easing, Dimensions} from 'react-native';
const screenHeight = Dimensions.get('window').height;

export default class SplashScreen extends Component {
    constructor() {
        super();
        this.spinValue = new Animated.Value(0);
        this.springValue = new Animated.Value(0.3);
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        this.spring().start(this.spin());
    }

    spring() {
        this.springValue.setValue(0.3);
        return Animated.spring(
            this.springValue,
            {
                toValue: 1,
                friction: 1
            }
        )
    }

    spin() {
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 1000,
                easing: Easing.linears
            }
        ).start(() => this.spin())
    }

    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['-9deg', '9deg', '-9deg']
        });
        console.log(JSON.stringify(spin));
        return (
            <View style={styles.container}>
                <Text style={{
                    textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: {width: -1, height: 1},
                    textShadowRadius: 10,
                    textAlign: 'center',
                    fontSize: 15,
                    color: "#ffffff",
                    fontFamily: 'akrobat_black'
                }}>Sản phẩm của PMCL group</Text>
                <Text style={{
                    textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: {width: -1, height: 1},
                    textShadowRadius: 10,
                    textAlign: 'center',
                    fontSize: 15,
                    color: "#ffffff",
                    fontFamily: 'akrobat_black'
                }}>Phiên bản 1.0</Text>
                <View style={{flexDirection: 'row', marginTop: screenHeight*0.1}}>
                    <Text style={{
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: {width: -1, height: 1},
                        textShadowRadius: 10,
                        textAlign: 'center',
                        fontSize: 50,
                        color: "#ffffff",
                        fontFamily: 'akrobat_black'
                    }}>Bóng đá </Text>
                    <Text style={{
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: {width: -1, height: 1},
                        textShadowRadius: 10,
                        textAlign: 'center',
                        fontSize: 50,
                        color: '#badc58',
                        fontFamily: 'akrobat_black'
                    }}>bụi</Text>
                </View>

                <Animated.Image
                    style={{
                        marginTop:'10%',
                        width: '60%',
                        height: '20%',
                        resizeMode: 'contain',
                        transform: [
                            {
                                rotate: spin
                            },
                            {scale: this.springValue}
                        ]
                    }}
                    source={require('../../assets/avatar.png')}
                />

                <Text style={{
                    marginTop:'15%',
                    textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: {width: -1, height: 1},
                    textShadowRadius: 10,
                    textAlign: 'center',
                    fontSize: 20,
                    color: "#ffffff",
                    fontFamily: 'akrobat_black'
                }}>"Chơi bóng ngay, cáp kèo liền tay"</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'center'
    }
})
