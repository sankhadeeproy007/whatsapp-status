import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

const { wWidth, wHeight } = Dimensions.get('window');

const IMAGE_HEIGHT = 300;

const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  debug,
  stopClock,
  block
} = Animated;

function runTiming(value, dest) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 200,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      // If the clock isn't running we reset all the animation params and start the clock
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    // we run the step here that is going to update position
    timing(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, debug('stop clock', stopClock(clock))),
    // we made the block return the updated position
    state.position
  ]);
}

function getYTranslateValue(yOffset, height) {
  return yOffset + (height / 2 - yOffset) - IMAGE_HEIGHT / 2;
}

export default class Status extends Component {
  constructor(props) {
    super(props);
    const { x, y, w, h } = props.position;
    // Image transform values
    this.imageTranslateX = runTiming(x, 0);
    this.imageTranslateY = runTiming(
      y,
      getYTranslateValue(y, this.props.windowHeight)
    );
    this.imageWidth = runTiming(w, this.props.windowWidth);
    this.imageHeight = runTiming(h, IMAGE_HEIGHT);

    // View transform values
    this.viewTranslateX = runTiming(x, 0);
    this.viewTranslateY = runTiming(y, 0);
    this.viewWidth = runTiming(w, this.props.windowWidth);
    this.viewHeight = runTiming(h, this.props.windowHeight);
  }

  render() {
    const {
      imageWidth,
      imageHeight,
      imageTranslateX,
      imageTranslateY,
      viewTranslateX,
      viewTranslateY,
      viewWidth,
      viewHeight
    } = this;
    const imageStyle = {
      width: imageWidth,
      height: imageHeight,
      transform: [
        { translateX: imageTranslateX },
        { translateY: imageTranslateY }
      ]
    };
    const viewStyle = {
      ...StyleSheet.absoluteFillObject,
      width: viewWidth,
      height: viewHeight,
      transform: [
        { translateX: viewTranslateX },
        { translateY: viewTranslateY }
      ]
    };
    return (
      <View style={styles.container}>
        <View>
          <Animated.View style={viewStyle}>
            <Image
              source={this.props.status.image}
              style={styles.overlayImage}
            />
            <View style={styles.overlay} />
          </Animated.View>
          <Animated.Image source={this.props.status.image} style={imageStyle} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  overlayImage: {
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  }
});
