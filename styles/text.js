import {StyleSheet, Dimensions} from 'react-native'
import {CONTENT_COLOR, CONTENT_COLOR_TWO, PRIMARY_COLOR, PRIMARY_COLOR_TWO , SUB_COLOR, SUB_COLOR_TWO} from "./color";

const fontSize = Dimensions.get('window').width * 0.03;
const PRIMARY_SIZE = fontSize*1.2;
const SUB_SIZE = fontSize*1.1;
const CONTENT_SIZE = fontSize;




export const CRUCIAL_TEXT_STYLES = StyleSheet.create({
    PRIMARY_COLOR: {
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        fontSize: PRIMARY_SIZE
    },
    PRIMARY_COLOR_TWO:{
        fontWeight: 'bold',
        color: PRIMARY_COLOR_TWO,
        fontSize: PRIMARY_SIZE
    },
    SUB_COLOR:{
        fontWeight: 'bold',
        color: SUB_COLOR,
        fontSize: PRIMARY_SIZE
    },

    SUB_COLOR_TWO:{
        fontWeight: 'bold',
        color: SUB_COLOR_TWO,
        fontSize: PRIMARY_SIZE
    },

    CONTENT_COLOR:{
        fontWeight: 'bold',
        color: CONTENT_COLOR,
        fontSize: PRIMARY_SIZE
    },
    CONTENT_COLOR_TWO:{
        fontWeight: 'bold',
        color: CONTENT_COLOR_TWO,
        fontSize: PRIMARY_SIZE
    },

    BLACK_COLOR: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: PRIMARY_SIZE
    },
    GREY_COLOR: {
        color: '#7f8c8d',
        fontSize: PRIMARY_SIZE
    },
    WHITE_COLOR:{
        fontWeight: 'bold',
        color: 'white',
        fontSize: PRIMARY_SIZE
    }
});

export const SUB_TEXT_STYLES=StyleSheet.create({
    PRIMARY_COLOR: {
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        fontSize: SUB_SIZE
    },
    PRIMARY_COLOR_TWO:{
        fontWeight: 'bold',
        color:PRIMARY_COLOR_TWO,
        fontSize: SUB_SIZE
    },
    SUB_COLOR:{
        fontWeight: 'bold',
        color: SUB_COLOR,
        fontSize: SUB_SIZE
    },

    SUB_COLOR_TWO:{
        fontWeight: 'bold',
        color: SUB_COLOR_TWO,
        fontSize: SUB_SIZE
    },

    CONTENT_COLOR:{
        fontWeight: 'bold',
        color: CONTENT_COLOR,
        fontSize: SUB_SIZE
    },

    CONTENT_COLOR_TWO:{
        fontWeight: 'bold',
        color: CONTENT_COLOR_TWO,
        fontSize: SUB_SIZE
    },


    BLACK_COLOR: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: SUB_SIZE
    },
    GREY_COLOR: {
        color: '#7f8c8d',
        fontSize: SUB_SIZE
    },
    WHITE_COLOR:{
        fontWeight: 'bold',
        color: 'white',
        fontSize: SUB_SIZE
    }
});


export const CONTENT_TEXT_STYLES=StyleSheet.create({
    PRIMARY_COLOR: {
        color: PRIMARY_COLOR,
        fontSize: CONTENT_SIZE
    },
    PRIMARY_COLOR_TWO:{
        color: PRIMARY_COLOR_TWO,
        fontSize: CONTENT_SIZE
    },
    SUB_COLOR:{
        color: SUB_COLOR,
        fontSize: CONTENT_SIZE
    },

    SUB_COLOR_TWO:{
        color: SUB_COLOR_TWO,
        fontSize: CONTENT_SIZE
    },

    CONTENT_COLOR:{
        color: CONTENT_COLOR,
        fontSize: CONTENT_SIZE
    },

    CONTENT_COLOR_TWO:{
        color: CONTENT_COLOR_TWO,
        fontSize: CONTENT_SIZE
    },


    BLACK_COLOR: {
        color: 'black',
        fontSize: CONTENT_SIZE
    },
    GREY_COLOR: {
        color: '#7f8c8d',
        fontSize: CONTENT_SIZE
    },
    WHITE_COLOR:{
        color: 'white',
        fontSize: CONTENT_SIZE
    }
});