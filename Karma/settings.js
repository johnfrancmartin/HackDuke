import React, { Component } from 'react';
import Dimensions from 'Dimensions';
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

import Meteor, { createContainer } from 'react-native-meteor';
import Overlay from 'react-native-overlay';

var styles = require('./styles');

class SettingsPop extends Component {

  goToPage(pageName) {
    this.props.navigator.push({title: "Category", index: 3, props: { name: pageName }});
  }

  settingsPopUp(){
    return [<Image source={require('./img/Settings.png')} resizeMode='contain' style={{position: 'relative', bottom: (720*Dimensions.get('window').width/1080), left: 0, alignSelf: 'center', transform: [{scale: Dimensions.get('window').width/1080}], zIndex: 1000}}/>,
    <TouchableOpacity style={this.settingsOnSelect(0)} onPress={() => this.goToPage('eating')}/>,
    <TouchableOpacity style={this.settingsOnSelect(1)} onPress={() => this.goToPage('mobile')}/>,
    <TouchableOpacity style={this.settingsOnSelect(2)} onPress={() => this.goToPage('recharge')}/>,]
  }

  settingsOnSelect(bottomPos){
    return {
      position: 'absolute',
      bottom: bottomPos*(240*Dimensions.get('window').width/1080),
      left: 0,
      width: Dimensions.get('window').width,
      height: 240*Dimensions.get('window').width/1080,
      backgroundColor: 'transparent',
      zIndex: 1001
    }
  }
  

  render() {
    return(
      <View>
        {this.settingsPopUp()}
      </View>
    );
  }
}

export default createContainer(params => {
  return {
    // Meteor requirements go here
  };
}, NavBar);
