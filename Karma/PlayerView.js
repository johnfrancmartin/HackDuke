import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  Navigator,
  View,
  WebView,
  Text,
  TouchableOpacity
} from "react-native";

var YouTube = require('react-native-youtube');

class PlayerView extends Component {
  constructor(props){
    super(props);
    this.state = {
      isReady: false,
      status: null,
      quality: null,
      error: null,
      isPlaying: true,
    };
  }

  render() {
    let windowWidth = Dimensions.get('window').width;
    let windowHeight = Dimensions.get('window').height;
    return (
      <View style = {locstyle.container}>
        <YouTube
          videoId="KVZ-P-ZI6W4"
          play={this.state.isPlaying}
          hidden={false}
          playsInline={true}
          onReady={(e)=>{this.setState({isReady: true})}}
          onChangeState={(e)=>{this.setState({status: e.state})}}
          onChangeQuality={(e)=>{this.setState({quality: e.quality})}}
          onError={(e)=>{this.setState({error: e.error})}}
          style={{alignSelf: 'stretch', height: 300, backgroundColor: 'black', marginVertical: 10}}
        />
        <TouchableOpacity
          onPress={() => this.props.navigator.pop()}>
          <Text style={{ color: '#40b2bf' }}>
            Close this video
          </Text>
          <Text style={locstyle.instructions}>{this.state.isReady ? 'Player is ready.' : 'Player setting up...'}</Text>
          <Text style={locstyle.instructions}>Status: {this.state.status}</Text>
          <Text style={locstyle.instructions}>Quality: {this.state.quality}</Text>
          <Text style={locstyle.instructions}>{this.state.error ? 'Error: ' + this.state.error : ' '}</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

const locstyle = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });


module.exports = PlayerView;
