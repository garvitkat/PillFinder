import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';


const Headerbar = (prop) => {
    return (
    <View style={style.headstyle}>
    <Text style={style.headfont}> {prop.headerText} </Text>
    </View>);
};
const style = StyleSheet.create({
    headstyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        paddingTop: 15,
        paddingBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        backgroundColor: '#4286f4'
      },
    headfont: {
        fontSize: 30,
        color: 'white',
    }
});
export default Headerbar;