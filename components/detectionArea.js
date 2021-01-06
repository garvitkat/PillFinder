import React, { Component } from 'react';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';

import { Platform, StyleSheet, Text, View, PanResponder, Image, Animated, Button } from 'react-native';
import { ToastAndroid } from 'react-native';
import Axios from 'axios';

class DetectionArea extends Component {
  distanceCalculator(touches) {
    if (touches.length == 2) {
      let x1 = touches[0].locationX
      let y1 = touches[0].locationY
      let x2 = touches[1].locationX
      let y2 = touches[1].locationY
      let dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5)
      this.setState({ distance: dist })
      this.checkMed(dist)
    }
    else {
      this.setState({ distance: 0 })
    }
  }

  checkMed(distance) {
    if (distance >= 100 && distance <= 150) {
      this.setState({ stage: "medPlaced", LastLastLastmedicine: "Medicine One" })
      this.setState({ medicine: "Medicine One", currentQuantity: this.state.Medicine1Quantity, currentTimes: this.state.Medicine1Times })
      if (this.state.Lastmedicine != "Medicine One") {
        this._onPressSpeech("Medicine One")
      }
    }
    else if (distance >= 160 && distance <= 200) {
      this.setState({ stage: "medPlaced", LastLastLastmedicine: "Medicine Two" })
      this.setState({ medicine: "Medicine Two", currentQuantity: this.state.Medicine2Quantity, currentTimes: this.state.Medicine2Times })
      if (this.state.Lastmedicine != "Medicine Two") {
        this._onPressSpeech("Medicine Two")
      }
    }
  }

  _onPressSpeech = (text) => {
    Tts.stop(text);
    this.setState({ subtitle: text })
    Tts.speak(text);
    this.setState({
      Lastmedicine: text,
      LastLastmedicine: this.state.medicine,
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      currentMessage: 'Place Bottle Here',
      touchCount: 0,
      distance: 0,
      medicine: "",
      Lastmedicine: "",
      LastLastmedicine: "",
      LastLastLastmedicine: "",
      recognized: '',
      started: '',
      results: [],
      currentQuantity: [0, 0],
      currentTimes: 0,
      Medicine1Quantity: [6, 10],
      Medicine2Quantity: [5, 20],
      Medicine1Times: 3,
      Medicine2Times: 2,
      subtitle: "",
      stage: "Empty",
      movement: ""
    };

    Tts.setDefaultLanguage('en-US');
    Tts.addEventListener("tts-finish", event => {
      this.setState({ ttsStatus: "finished", subtitle: "" })
      if (this.state.currentTimes == 0 && this.state.stage != "medPlaced" && this.state.stage != "ordermoreConfirm") {
        this._startRecognition()
      }
      if (this.state.stage == "ordermoreConfirm") {
        this._startRecognition()
        this.setState({ stage: "ordermoreConfirm1" })
      }
    }
    ); 
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {

        if (gestureState.dx > 50) {
          this.setState({ movement: "left" })
        }
        if (gestureState.dx < -30) {
          this.setState({ movement: "right" })
          this.setState({ movement: "right" })
        }
        if (gestureState.dx == 0) {
          this.setState({ movement: "" })
        }
        if (evt.nativeEvent.touches.length >= 1) {
          this.distanceCalculator(evt.nativeEvent.touches)
          this.setState({ currentMessage: 'Detected' })
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.medicine == this.state.Lastmedicine && this.state.currentTimes != 0) {
          this.setState({ stage: "DidYouTakeIt" })

          this._onPressSpeech("You need to take it " + this.state.currentTimes + " times a day. Did you take it?")
        }
        if (evt.nativeEvent.touches.length == 0) {
          this.setState({ currentMessage: 'Place Container Here', distance: 0, medicine: "", Lastmedicine: "", currentQuantity: [0, 0], currentTimes: 0 })
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }
  onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  };
  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  };
  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
    if (this.state.results.includes('yes')) {
      this.state.LastLastmedicine == "Medicine One" ? this.setState({ Medicine1Quantity: [this.state.Medicine1Quantity[0] - 1, this.state.Medicine1Quantity[1]] }) : this.setState({ Medicine2Quantity: [this.state.Medicine2Quantity[0] - 1, this.state.Medicine2Quantity[1]] })
      this.setState({ subtitle: this.state.Medicine1Quantity[0] + " Pills Remaining" })
      this._onPressSpeech(this.state.Medicine1Quantity[0] + " Pills Remaining")
      if (this.state.Medicine2Quantity[0] <= 4 && this.state.stage != "ordermoreConfirm1") {
        this._onPressSpeech("You're running out of this, do you want to order more ?")
        this.setState({ stage: 'ordermoreConfirm' })
      }
      if (this.state.stage == "ordermoreConfirm1") {
        this._onPressSpeech("Okay, Ordering More")
        Axios.get("http://darsh.pythonanywhere.com/set/"+"Medicine Two").then((res) => { console.log(res) })
        this.setState({ stage: "Empty" })
        
      }
    }
  }
  async _startRecognition(e) {
    this.setState({
      recognized: '',
      started: '',
      results: [],
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    return (
      <View style={style.headstyle} {...this._panResponder.panHandlers} >
        <Animated.View
        >
          <Text style={style.headfont}>
            {this.state.currentMessage}
          </Text>
          {
            (this.state.currentQuantity[1]) ? <Text style={style.medicineAlt}>{this.state.currentQuantity[0] + '/' + this.state.currentQuantity[1] + ' Remaining'}</Text> : null
          }
          {
            (this.state.currentTimes) ? <Text style={style.medicineAlt1}>{'Take it ' + this.state.currentTimes + ' times a day'}</Text> : null
          }
          <Text style={style.medicineText}>
            {this.state.medicine}
          </Text>

          <Text style={style.subtitleText}>
            {this.state.subtitle}
          </Text>
        </Animated.View>
      </View>);
  }
};
const style = StyleSheet.create({
  headstyle: {
    fontSize: 30,
    color: 'grey',
    height: "100%",
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingLeft: 20
  },
  headfont: {
    color: 'grey',
    fontSize: 35,
    paddingTop: '50%'
  },
  medicineText: {
    color: 'grey',
    fontSize: 35,
    paddingTop: '0%'
  },
  medicineAlt: {
    color: 'grey',
    fontSize: 25,
    paddingTop: '50%',
    paddingLeft: 20
  },
  medicineAlt1: {
    color: 'grey',
    fontSize: 20,
    paddingLeft: 20
  },
  subtitleText: {
    color: 'grey',
    fontSize: 15,
    paddingLeft: 20
  },
  box: {
    backgroundColor: '#cc0000',
    width: 200,
    height: 200,
    borderRadius: 5,
  },
});

export default DetectionArea;
