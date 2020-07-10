import React from 'react';
import { Animated, StyleSheet } from 'react-native';

import {
  RotationGestureHandler,
  State,
} from 'react-native-gesture-handler';

// import { USE_NATIVE_DRIVER } from '../config';

export class PinchableBox extends React.Component {
  panRef = React.createRef();
  rotationRef = React.createRef();
  pinchRef = React.createRef();

  
  constructor(props) {
    super(props);



    /* Rotation */
    this._rotate = new Animated.Value(0);
    this._rotateStr = this._rotate.interpolate({
      inputRange: [-100, 100],
      outputRange: ['-100rad', '100rad'],
    });
    this._lastRotate = 0;
    this._onRotateGestureEvent = Animated.event(
      [{ nativeEvent: { rotation: this._rotate } }],
    //   { useNativeDriver: USE_NATIVE_DRIVER }
    );


  }

  _onRotateHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate += event.nativeEvent.rotation;
      this._rotate.setOffset(this._lastRotate);
      this._rotate.setValue(0);
    }
  };
  _onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale *= event.nativeEvent.scale;
      this._baseScale.setValue(this._lastScale);
      this._pinchScale.setValue(1);
    }
  };
  _onTiltGestureStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastTilt += event.nativeEvent.translationY;
      this._tilt.setOffset(this._lastTilt);
      this._tilt.setValue(0);
    }
  };
  render() {
    return (

          <RotationGestureHandler
            ref={this.rotationRef}
            simultaneousHandlers={this.pinchRef}
            onGestureEvent={this._onRotateGestureEvent}
            onHandlerStateChange={this._onRotateHandlerStateChange}>
            <Animated.View style={styles.wrapper}>
      
                  <Animated.Image
                    style={[
                      styles.pinchableImage,
                      {
                        transform: [
                          { perspective: 200 },
                          { rotate: this._rotateStr },
                        ],
                      },
                    ]}
                    source={require('../images/profile.jpg')}
                  />

            </Animated.View>
          </RotationGestureHandler>
    );
  }
}

export default PinchableBox;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pinchableImage: {
    width: 250,
    height: 250,
  },
  wrapper: {
    flex: 1,
  },
});