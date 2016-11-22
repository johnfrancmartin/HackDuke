import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  Slider,
  DatePickerIOS,
  Picker,
  PickerIOS,
  Image,
  AlertIOS,
  TouchableOpacity,
  Linking,
  AsyncStorage,
  Navigator,
  View
} from 'react-native';

import Dimensions from 'Dimensions';
import Form from 'react-native-form';
import Meteor, { createContainer } from 'react-native-meteor';
import Overlay from 'react-native-overlay';
import Learn from './learn';
import Focus from './focus';

var styles = require('./styles');
var karmaCheck = require('./karmaCheck');

import NavBar from './navbar';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {currentView: 'focus'}
    this.menuClick = false;
    this.settingsClick = false;
    karmaCheck.checkKarmaNaN();
  }

  logout() {
    Meteor.logout((err) => {
      if (err) {
        alert(err.reason);
      } else {
        AsyncStorage.removeItem('user')
          .then(() => this.props.navigator.replace({ title: "Login", index: 0 }));
      }
    });

  }

  getView(){
    var view = null;
    if (this.props.currentView == "focus"){
      view = <Focus navigator={this.props.navigator} />
    } else if (this.props.currentView == "learn"){
      view = <Learn navigator={this.props.navigator} />
    }
    return view;
  }

  render() {
    var listView = this.getView();
    var padding = 40;
    return (
      <View style={styles.container}>
        {!this.props.ready && <Overlay isVisible={true}><Text>Loading...</Text></Overlay>}
        <View style={{position: 'relative', zIndex: 1000}}>
          <NavBar navigator={this.props.navigator} currentView={this.props.currentView}/>
        </View>
        <View style={{position: 'relative', top: -100}}>
          {this.getView()}
        </View>
        <View style={{height:35}}/>
        <Text onPress={() => this.logout()} > Log Out </Text>
      </View>
    );
  }

}

export default createContainer(params => {
  let an = Meteor.subscribe('analysis');
  let al = Meteor.subscribe('allocation');
  let cl = Meteor.subscribe('cells');

  return {
    userId: Meteor.userId(),
    ready: an.ready() && cl.ready(),
    analysis: Meteor.collection('analysis').findOne({ userId: Meteor.userId() }),
    allocation: Meteor.collection('allocations').findOne({ userId: Meteor.userId() }),
    cells: Meteor.collection('cells'),
  };
}, Dashboard);
