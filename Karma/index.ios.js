/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import {
  AppRegistry,
  ActivityIndicator,
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
import Dashboard from './dashboard';
import EStyleSheet from 'react-native-extended-stylesheet'
import DefaultStyle from './DefaultStyle'
var styles = require('./styles');

import VideoListView from './VideoListView';
import PlayerView from './PlayerView';

Meteor.connect("ws://app.mymoneycomb.com/websocket");
var GiftedSpinner = require('react-native-gifted-spinner');


EStyleSheet.build(DefaultStyle);

// TODO: Remove console warnings disabler
console.disableYellowBox = true;

// TODO: Extract into own file
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '' , animating: true};
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  signIn() {
    if(!this.validateEmail(this.state.username) || this.state.password.length < 3) {
      alert("Please enter a valid email and password");
    }
    else{
      Meteor.loginWithPassword(this.state.username, this.state.password, (err) => {
        if (err) {
          alert(err.reason);
        } else {
          AsyncStorage.setItem('user', 'true');
          AsyncStorage.setItem('username', this.state.username);
          AsyncStorage.setItem('password', this.state.password)
            .then(() => this.props.navigator.replace({ title: "Dashboard", index: 1, currentView: 'focus' }));
        }
      });
    }
  }

  openRegister() {
    Linking.openURL("https://app.mymoneycomb.com/register").catch(err => console.error('An error occurred', err));
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}} />
        <View style={{flex: 2, justifyContent: 'center'}}>
          <Image source={require('./Octocat.png')} resizeMode='contain' style={{width: 300, height: 200}}/>
        </View>
        <View style={{flex: 1}} />
        <View style={{flex: 5}} >
          <Form ref="form">
            <TextInput
            style={styles.inputs}
            name="myUsername"
            keyboardType='email-address'
            placeholder='username'
            onChangeText={(username) => this.setState({username})}
            value={this.state.username} />

            <TextInput
            style={styles.inputs}
            name="myUsername"
            placeholder='password'
            secureTextEntry='true'
            onChangeText={(password) => this.setState({password})}
            value={this.state.password} />


            <View style={{height: 50}} />

            <TouchableOpacity onPress={this.signIn.bind(this)}>
              <View style={styles.button}>
                <Text style={styles.buttontext}>Get Started</Text>
              </View>
            </TouchableOpacity>

            <View style={{height: 25}} />

            <TouchableOpacity onPress={this.openRegister.bind(this)}>
              <Text style={styles.signup}>Dont Have an Account? Sign Up</Text>
            </TouchableOpacity>
          </Form>
        </View>
      </View>
    );
  }
}

class Karma extends Component {

  constructor(props) {
    super(props);
    this.state = { initialRoute: null };
  }

  renderScene(route, nav) {
    switch (route.index) {
      case 0:
        return <Login navigator={nav} />
      case 1:
        return <Dashboard navigator={nav} currentView={route.currentView} dashboard={route.dashboard}/>
      case 2:
        return <VideoListView navigator={nav}
                playlistID="PLF76F25F55798FDBC" />
      case 3:
        return <PlayerView navigator={nav}
                videoID={route.videoID} />
      // case 4:
      //   return <ArticleView navigator={nav} title={route.title} />
    }
  }

  initialPage() {
    return AsyncStorage.getItem('user').then((id) => {
      if (id !== null || Meteor.user() !== null) {
        AsyncStorage.getItem('username').then((username) => {
          AsyncStorage.getItem('password').then((password) => {
            Meteor.loginWithPassword(username, password, (err) => {
              if (err) {
                this.setState({
                  initialRoute: { title: "Login", index: 0 }
                });
              } else {
                this.setState({
                  initialRoute: {title: "Dashboard", index: 1, currentView: 'focus'}
                });
              }
            })
          })
        });

      } else {
        this.setState({
          initialRoute: { title: "Login", index: 0 }
        });
      }
    });
  }

  render() {
    if (this.state.initialRoute == null) {
      this.initialPage();
      return(
      <View style={styles.container}><View style={{height: 200}} />
          <ActivityIndicator
            animating={this.state.animating}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
      </View>)
    }
    return (
      <Navigator
        style={{ flex: 1 }}
        initialRoute={ this.state.initialRoute}
        renderScene={ this.renderScene } />
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
});

AppRegistry.registerComponent('Karma', () => Karma);
