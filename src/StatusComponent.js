import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image
} from 'react-native';

export default class StatusComponent extends Component {
  render() {
    const { name, time, image } = this.props.profile;
    return (
      <TouchableWithoutFeedback>
        <View style={styles.statusLine}>
          <View style={styles.imageRing}>
            <Image source={image} style={styles.image} />
          </View>
          <View style={styles.statusDesc}>
            <Text style={styles.statusName}>{name}</Text>
            <Text style={styles.statusTime}>{time}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  statusLine: {
    height: 90,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDesc: {
    marginLeft: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#c1c1c1',
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  statusName: {
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: 0.2,
    lineHeight: 22
  },
  statusTime: {
    color: '#a7a7a7',
    fontSize: 16,
    letterSpacing: 0.2,
    lineHeight: 20
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 30
  },
  imageRing: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: '#b3b3b3'
  }
});
