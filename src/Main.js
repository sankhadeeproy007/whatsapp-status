import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Asset } from 'expo';
const { width, height } = Dimensions.get('window');

import StatusComponent from './StatusComponent';
import Status from './Status';

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
    this.state = {
      selectedStatus: null,
      ready: false,
      position: null
    };
    this.status = data.map(() => React.createRef());
  }

  async componentDidMount() {
    await Promise.all(data.map(data => Asset.loadAsync(data.image)));
    this.setState({ ready: true });
  }

  setStatus = async (profile, index) => {
    const position = await this.status[index].current.measure();
    this.setState({
      selectedStatus: profile,
      position
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Status</Text>
        </View>
        {/* Please use Flatlist here.
          ScrollView because too lazy.
          And pardon the key.
        */}
        {this.state.ready ? (
          <ScrollView>
            {data.map((profile, index) => (
              <StatusComponent
                {...{ profile }}
                ref={this.status[index]}
                onPress={() => this.setStatus(profile, index)}
                key={profile.name}
              />
            ))}
          </ScrollView>
        ) : (
          <ActivityIndicator />
        )}
        {this.state.selectedStatus && (
          <Status
            status={this.state.selectedStatus}
            position={this.state.position}
            windowWidth={width}
            windowHeight={height}
          />
        )}
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
