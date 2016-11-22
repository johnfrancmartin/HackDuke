import React, { Component } from 'react';

import {
  AsyncStorage,
} from 'react-native';

module.exports = {
  async checkKarmaNaN() {
    let bad = await AsyncStorage.getItem('badkarma');
    let good = await AsyncStorage.getItem('goodkarma');
    if (isNaN(bad)){
      await AsyncStorage.setItem('badkarma', (1).toString());
    }
    if(isNaN(good)){
        await AsyncStorage.setItem('goodkarma', (1).toString());
    }
  },

  async getRatio(){
    var ratio = 1;
    alert("hi");
    try {
      let badkarma = await AsyncStorage.getItem('badkarma');
      if (badkarma == null){
        badkarma = 1;
      } else {
        badkarma = parseInt(badkarma) + 1;
      }
      var goodkarma =  await AsyncStorage.getItem('goodkarma');
      if (goodkarma == null){
        goodkarma = 1;
      } else {
        goodkarma = parseInt(goodkarma) + 1;
      }
      ratio = badkarma/goodkarma;
      if (isNaN(ratio)){
        ratio = 1;
      }
      return ratio;
    } catch (error) {
      ratio = 1;
    }
    return ratio;
  },
}
