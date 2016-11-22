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
  ListView,
  AsyncStorage,
  Navigator,
  View
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import Overlay from 'react-native-overlay';
import CheckBox from 'react-native-checkbox';
import EStyleSheet from 'react-native-extended-stylesheet';
import createFragment from 'react-addons-create-fragment' // ES6

// import { CheckboxField, Checkbox } from 'react-native-checkbox-field';

var styles = require('./styles');
var SourceOptions = require('./SourceOptions');
var karmaCheck = require('./karmaCheck');

class Preferences extends Component {

  constructor(props){
    super(props);
    this.state = {loaded: false, karma: 50, myPrefs: [], keys: Object.keys(SourceOptions), checkboxArray: []};

  }

  async componentWillMount(){
    var copy = Object.assign({}, SourceOptions);
    var keys = Object.keys(SourceOptions);
    for (i = 0; i < keys.length; i++){
      let key = keys[i];
      await this.getCheckByKey(key);
    };
    this.state.karma = await karmaCheck.getRatio();
    this.setState({loaded: true});
  }

  async getCheckByKey(key){
    try {
      let a = await AsyncStorage.getItem(key);
      if (a == null || a == "false"){
        this.state.checkboxArray[key] = false;
      } else if (a == "true"){
        this.state.checkboxArray[key] = true;
      }
    } catch (error) {
      // Error saving data
    }
  }

  async checkBox(checked, key){
    this.state.checkboxArray[key] = checked;
    if (checked){
      var val = "true";
    } else {
      var val = "false";
    }
    this.forceUpdate();
    try {
      await AsyncStorage.setItem(key, val);
    } catch (error) {
      // Error saving data
    }
  }

  getRows(){
    var keys = Object.keys(SourceOptions);
    var prefViews = [];
    for (var i = 0; i < keys.length; i++){
      let key = keys[i];
      prefViews.push(
        <View style={{alignSelf: 'center', alignItems: 'flex-start', height: 40}}>
          <CheckBox
              style={{alignSelf: 'center'}}
              label={key}
              checked={this.state.checkboxArray[key]}
              onChange={(checked) => this.checkBox(checked, key)}
            />
        </View>
      )
    }
    return (prefViews);
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
    let keysLength = Object.keys(SourceOptions).length
    let checkboxHeight = 40;
    let padding = 10;
    if (this.state.loaded){
      return(
        <View style = {{position: 'absolute', alignItems: 'center', top: 200, left: 0.15*Dimensions.get('window').width,
        width: 0.7*Dimensions.get('window').width, borderRadius: 10, height: checkboxHeight*keysLength+2*padding, backgroundColor: 'white'}}>
          <View style = {{height: padding}}/>
          <Text>{this.state.karma}</Text>
          <View style = {{height: padding}}/>
          <ListView
            dataSource={ds.cloneWithRows(this.getRows())}
            renderRow={(rowData) => <View style={{alignSelf: 'center', alignItems: 'center'}}>{rowData}</View>}
            renderSeparator={this.renderSeparator}
          />
          <View style = {{height: padding}}/>
        </View>
      );
    } else {
      return null;
    }
  }

}

const localStyleSheet = EStyleSheet.create({
  rowSeperator: {
    backgroundColor: 'rgba(0,0,0,0)',
    height: 20,
    marginLeft: 4,
  },
  rowSeperatorHighlighted: {
    opacity: 0.0,
  },
  organization: {
    color: 'lightgrey',
    fontSize: 14,
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    marginVertical: 3,
    marginTop: 2,
    marginBottom: 2,
  },
  headline: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0)',
    textAlign: 'center',
    marginBottom: 2,
  },
  description: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    marginLeft: 6,
    marginBottom: 2,
  },
  date: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    textAlign: 'left',
    backgroundColor: 'rgba(0,0,0,0)',
    padding: 2,
  },
  imageTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'center',
    top: 60
  },
});



  export default createContainer(params => {
    return {
      // Meteor requirements go here
    };
  }, Preferences);
