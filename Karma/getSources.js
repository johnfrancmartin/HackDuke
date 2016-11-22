import React, { Component } from 'react';

var karmaCheck = require('./karmaCheck');
var SourceOptions = require('./SourceOptions');
import {
  AsyncStorage,
} from 'react-native';

module.exports = {
  async getSources(karmaChoice){
    var ratio = await karmaCheck.getRatio();
    var options = Object.keys(SourceOptions);
    var good = [];
    var bad = [];
    for (i = 0; i < options.length; i++){
      let key = options[i];
      let temp =  await AsyncStorage.getItem(key);
      if (temp == null || temp == "true"){
        good.push(key);
      } else {
        bad.push(key);
      }
    }
    var badCopy = bad.slice()
    if (ratio < 3){

    } else if (ratio < 5) {
      let random = Math.floor(Math.random()*badCopy.length);
      good.push(badCopy[random]);
    } else if (ratio < 8){
      let bl = badCopy.length;
      for (i = 0; i < 2 && i < bl; i++){
        let random = Math.floor(Math.random()*badCopy.length);
        good.push(bad[random]);
        badCopy.splice(random, 1);
      }
    } else {
      for (i = 0; i < badCopy.length; i++){
        good.push(bad[i]);
      }
    }
    if (karmaChoice == "good"){
      return good;
    } else if (karmaChoice == "bad"){
      return bad;
    }
  },
}
