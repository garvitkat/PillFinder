import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableHighlight} from 'react-native';



class ProfileHeader extends Component { 
    constructor(props) {
        super(props);
      }

    render() {
        return (
    <View style={style.headstyle}>
    <TouchableHighlight style={[style.profileImgContainer]}>
    <Image source={require('./../images/profile.jpg')} style={style.profileImg} />
    </TouchableHighlight>
    <Text style={style.headfont}>Hello, Garvit!</Text>
    </View>);
    }
   };

const style = StyleSheet.create({
    headstyle: {
        flexDirection: 'row',
        height: 80,
        paddingTop: 5,
        paddingBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
      },
    headfont: {
        fontSize: 30,
        color: 'grey',
        paddingTop: 15,
        paddingLeft: 20
    },

    profileImgContainer: {
        marginLeft: 8,
        height: 70,
        width: 70,
        borderRadius: 50,
        borderWidth: 0,
        overflow: 'hidden'
    },
    profileImg: {
        height: 70,
        width: 70,
        borderWidth: 0,
        borderRadius: 40,
      },
});
export default ProfileHeader;
