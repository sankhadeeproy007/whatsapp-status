import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import StatusComponent from './StatusComponent';

const data = [
  {
    name: 'Salah',
    time: '4 hours ago',
    image: require('./../assets/salah.jpg')
  },
  {
    name: 'Hazard',
    time: '2 hours ago',
    image: require('./../assets/hazard.jpg')
  },
  {
    name: 'Mourinho',
    time: '22 minutes ago',
    image: require('./../assets/mourinho.jpg')
  },
  {
    name: 'Pep',
    time: '6 hours ago',
    image: require('./../assets/pep.jpg')
  },
  {
    name: 'Son',
    time: '23 hours ago',
    image: require('./../assets/son.jpg')
  },
  {
    name: 'Klopp',
    time: '2 hours ago',
    image: require('./../assets/klopp.jpg')
  }
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Status</Text>
        </View>
        <ScrollView>
          {data.map(profile => (
            <StatusComponent {...{ profile }} key={profile.name} />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    height: 75,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#c1c1c1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontWeight: '600',
    paddingTop: 15,
    fontSize: 18
  }
});
