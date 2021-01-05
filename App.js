/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import { Provider } from 'react-redux';
import ProfileHeader from './components/profile'
import DetectionArea from './components/detectionArea'
import initstore from './store';

type Props = {};
console.log(initstore.getState());
console.reportErrorsAsExceptions = false;
console.disableYellowBox = true;
export default class App extends Component<Props> {
  render() {
    return (
      <Provider store = {initstore}>
      <Image source={require('./images/banner.png')} />
      <ProfileHeader />
      <DetectionArea />
      </Provider>
    );
  }
}

