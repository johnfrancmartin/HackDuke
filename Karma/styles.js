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

import Form from 'react-native-form';
import Meteor, { createContainer } from 'react-native-meteor';

module.exports = StyleSheet.create({
  container: {
    top: 20,
    flex: 2,
    alignItems: 'center',
  },
  inputs: {
    alignSelf: 'center',
    height: 40,
    borderBottomColor: 'black',
    width: 500,
    textAlign: 'center',
  },
//Button Syles
  button: {
    alignSelf: 'center',
    backgroundColor: '#F9A01B',
    height: 35,
    width: 100,
    borderRadius: 3
  },
  buttontext: {
    textAlign: 'center',
    color: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: 9
  },
  signup: {
    textAlign: 'center',
    color: '#F9A01B'
  },
  // TODO: Make hexagon overlays dynamically adaptable
  nav: {
    position: 'absolute',
    top: 20,
    left: 185*Dimensions.get('window').width/1080,
    width: 712*Dimensions.get('window').width/1080,
    height: 175*Dimensions.get('window').width/1080,
    backgroundColor: 'transparent',
    zIndex: 1001
  },
  navHome: {
    position: 'absolute',
    top: 20,
    left: 0,
    width: 185*Dimensions.get('window').width/1080,
    height: 175*Dimensions.get('window').width/1080,
    backgroundColor: 'transparent',
    zIndex: 1001
  },
  navSettings: {
    position: 'absolute',
    top: 20,
    right: 0,
    width: 185*Dimensions.get('window').width/1080,
    height: 175*Dimensions.get('window').width/1080,
    backgroundColor: 'transparent',
    zIndex: 1001
  },
  hexagon: {
    width: 55,
    height: 100,
  },
  hexagonRect1: {
    position: 'absolute',
    top: 0,
    left: 58,
    width: 57,
    height: 100,
    backgroundColor: 'transparent'
  },
  hexagonRect2: {
    position: 'absolute',
    top: 0,
    left: 58,
    width: 57,
    height: 100,
    transform: [{rotate: '60deg'}],
    backgroundColor: 'transparent'
  },
  hexagonRect3: {
    position: 'absolute',
    top: 0,
    left: 58,
    width: 57,
    height: 100,
    transform: [{rotate: '120deg'}],
    backgroundColor: 'transparent'
  },
});
