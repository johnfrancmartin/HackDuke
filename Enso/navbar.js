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
import Preferences from './Preferences';

var styles = require('./styles');

class NavBar extends Component {

  constructor(props){
    super(props);
    this.state = {prefClick: false};
  }

  focusView(){
    // this.props.navigator.push({title: "video", index: 2});
    this.props.dashboard.setState({currentView: "focus", loaded: false})
  }

  learnView(){
    this.props.dashboard.setState({currentView: "learn", loaded: false})
  }

  guru(){
    if (this.state.prefClick && this.props.currentView == "focus"){
      this.focusView();
    } else if (this.state.prefClick && this.props.currentView == "focus"){
      this.learnView();
    }
    this.setState({prefClick: !this.state.prefClick});
  }

  searchView(){
    this.props.dashboard.setState({currentView: "search", loaded: false})
  }

  getPrefs(){
    if (this.state.prefClick){
      return <Preferences navigator={this.props.nav}/>
    }
  }

  getNavImage(){
    if (this.props.currentView == "focus"){
      return (
        <Image source = {require("./img/NavFocus.png")}
          style={{positon: 'relative', height: 0.16*Dimensions.get('window').width, width: Dimensions.get('window').width}}
          resizeMode={Image.resizeMode.cover}/>
        )
    } else if (this.props.currentView == "learn"){
      return (
        <Image source = {require("./img/NavLearn.png")}
          style={{positon: 'relative', height: 0.16*Dimensions.get('window').width, width: Dimensions.get('window').width}}
          resizeMode={Image.resizeMode.cover}/>
        )
    } else if (this.props.currentView == "search"){
      return (
        <Image source = {require("./img/NavSearch.png")}
          style={{positon: 'relative', height: 0.16*Dimensions.get('window').width, width: Dimensions.get('window').width}}
          resizeMode={Image.resizeMode.cover}/>
        )
    } else if (this.props.currentView == "guru"){
      return (
        <Image source = {require("./img/NavGuru.png")}
          style={{positon: 'relative', height: 0.16*Dimensions.get('window').width, width: Dimensions.get('window').width}}
          resizeMode={Image.resizeMode.cover}/>
        )
    }
  }

  render() {
    let navBarHeight = 75;
    let gapWidth = 2;
    let height = 60;
    let topPadding = 20;
    let viewWidth = Dimensions.get('window').width;
    let viewHeight = Dimensions.get('window').height;
    return (
      <View>
        {this.getPrefs()}
        <View style = {{position: 'relative', top: viewHeight-height-topPadding, left: -viewWidth/2, width: viewWidth, height: height}}>
          {this.getNavImage()}
        </View>
        <TouchableOpacity style = {{position: 'relative', top: viewHeight-2*height-topPadding, left: -viewWidth/2, height: height, width: viewWidth/4,
                                    backgroundColor: 'transparent'}} onPress={() => this.focusView()}/>
        <TouchableOpacity style = {{position: 'relative', top: viewHeight-3*height-topPadding, left: -viewWidth/2+viewWidth/4, height: height, width: viewWidth/4,
                                    backgroundColor: 'transparent'}} onPress={() => this.guru()}/>
        <TouchableOpacity style = {{position: 'relative', top: viewHeight-4*height-topPadding, left: -viewWidth/2+2*viewWidth/4, height: height, width: viewWidth/4,
                                    backgroundColor: 'transparent'}} onPress={() => this.searchView()}/>
        <TouchableOpacity style = {{position: 'relative', top: viewHeight-5*height-topPadding, left: -viewWidth/2+3*viewWidth/4, height: height, width: viewWidth/4,
                                    backgroundColor: 'transparent'}} onPress={() => this.learnView()}/>
      </View>
    )
    // return(
    //   <View style = {{position: 'relative'}}>
    //
    //   </View>
    // );
  }

}



  export default createContainer(params => {
    return {
      // Meteor requirements go here
    };
  }, NavBar);
