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

class NavBar extends Component {

  focus(){
    // this.props.navigator.push({title: "video", index: 2});
    this.props.navigator.push({title: "News Items", index: 4});
  }

  learn(){
    this.props.navigator.push({title: "list", index: 1});
  }

  guru(){

  }

  render() {
    var navBarHeight = 75;
    var gapWidth = 2;
    return(
      <View style = {{position: 'relative'}}>
        <View>
        <Image source = {require("./img/Nav.png")}
            style={{positon: 'absolute', top: Dimensions.get('window').height-20-0.2723785166*Dimensions.get('window').width, left:0, height: 0.2723785166*Dimensions.get('window').width, width: Dimensions.get('window').width}}
            resizeMode={Image.resizeMode.cover}/>
        </View>
        <View style = {{position: 'absolute'}}>
          <TouchableOpacity style = {{position: 'absolute', left: 0, top: 11*Dimensions.get('window').height/13-20-navBarHeight, height: navBarHeight, width: Dimensions.get('window').width/3, backgroundColor: 'transparent'}} onPress={() => this.focus()}/>
          <TouchableOpacity style = {{position: 'absolute', left: Dimensions.get('window').width/3, top: 11*Dimensions.get('window').height/13-20-navBarHeight, height: navBarHeight, width: Dimensions.get('window').width/3, backgroundColor: 'transparent'}} onPress={() => this.guru()}/>
          <TouchableOpacity style = {{position: 'absolute', left: 2*Dimensions.get('window').width/3, top: 11*Dimensions.get('window').height/13-20-navBarHeight, height: navBarHeight, width: Dimensions.get('window').width/3, backgroundColor: 'transparent'}} onPress={() => this.learn()}/>
        </View>
      </View>
    );
  }

}



  export default createContainer(params => {
    return {
      // Meteor requirements go here
    };
  }, NavBar);
