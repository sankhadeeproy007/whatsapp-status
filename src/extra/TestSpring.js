import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const {
  event,
  Value,
  cond,
  eq,
  set,
  add,
  interpolate,
  Clock,
  diff,
  multiply,
  divide,
  startClock,
  stopClock,
  abs,
  lessThan,
  sub,
  greaterThan
} = Animated;

const VELOCITY_THRESHOLD = 0.5;
const POSITION_THRESHOLD = 0.5;
const VELOCITY = 50;

const EPS = 1e-3;
const EMPTY_FRAMES_THRESHOLDS = 5;

function stopWhenNeeded(dt, position, velocity, clock) {
  const ds = diff(position);
  const noMovementFrames = new Value(0);

  return cond(
    lessThan(abs(ds), EPS),
    [
      set(noMovementFrames, add(noMovementFrames, 1)),
      cond(
        greaterThan(noMovementFrames, EMPTY_FRAMES_THRESHOLDS),
        stopClock(clock)
      )
    ],
    set(noMovementFrames, 0)
  );
}

function force(dt, position, velocity) {
  return set(
    velocity,
    cond(
      lessThan(position, -POSITION_THRESHOLD),
      VELOCITY,
      cond(greaterThan(position, POSITION_THRESHOLD), -VELOCITY, 0)
    )
  );
}

function spring(dt, position, velocity, anchor, mass = 1, tension = 300) {
  const dist = sub(position, anchor);
  const acc = divide(multiply(-1, tension, dist), mass);
  return set(velocity, add(velocity, multiply(dt, acc)));
}

function damping(dt, velocity, mass = 1, damping = 22) {
  const acc = divide(multiply(-1, damping, velocity), mass);
  return set(velocity, add(velocity, multiply(dt, acc)));
}

function interaction(gestureTranslation, gestureState) {
  const dragging = new Value(0);
  const start = new Value(0);
  const position = new Value(0);
  const velocity = new Value(0);

  const clock = new Clock();
  const dt = divide(diff(clock), 1000);

  return cond(
    eq(gestureState, State.ACTIVE),
    [
      cond(dragging, 0, [set(dragging, 1), set(start, position)]),
      stopClock(clock),
      dt,
      set(position, add(start, gestureTranslation))
    ],
    [
      set(dragging, 0),
      startClock(clock),
      spring(dt, position, velocity, 0),
      damping(dt, velocity),
      set(position, add(position, multiply(velocity, dt)))
    ]
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const gestureX = new Value(0);
    const state = new Value(-1);

    this.onGestureEvent = event([
      {
        nativeEvent: {
          translationX: gestureX,
          state: state
        }
      }
    ]);

    this._transX = interaction(gestureX, state);
  }

  render() {
    const { onGestureEvent, _transX } = this;
    borderRadius = interpolate(_transX, {
      inputRange: [-(width / 3.2), 0, width / 3.2],
      outputRange: [50, 0, 50]
    });
    return (
      <View style={styles.container}>
        <PanGestureHandler
          maxPointers={1}
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onGestureEvent}
        >
          <Animated.View
            style={[
              styles.box,
              {
                borderRadius,
                transform: [{ translateX: _transX }]
              }
            ]}
          />
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: { height: 100, width: 100, backgroundColor: 'green' },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
