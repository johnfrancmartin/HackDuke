import React, { Component } from 'react';
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
  ListView,
  AsyncStorage,
  Navigator,
  View
} from 'react-native';

import Dimensions from 'Dimensions';
import Form from 'react-native-form';
import Meteor, { createContainer } from 'react-native-meteor';
import Overlay from 'react-native-overlay';
import EStyleSheet from 'react-native-extended-stylesheet';

var styles = require('./styles');
var DOMParser = require('xmldom').DOMParser;
var GiftedSpinner = require('react-native-gifted-spinner');
var SourceOptions = require('./SourceOptions');


class Learn extends Component {

  constructor(props) {
    super(props);
    this.state = {loaded: false, videos: [], news: [], undisplayedVideos: [], undisplayedNews: []}
  }

  componentWillMount(){
    var sourceChoices = this.getSources();
    var sources = []
    for (let i = 0; i < sourceChoices.length; i++){
      this.fetchNewsApi(SourceOptions[sourceChoices[i]]);
    }
    var ytListIDs = [
      "PLJ8cMiYb3G5cX8x8hoIcd8NhMin3hqxzf",
      "PLwq1lYlgzlfrCEHl5bnm-24ho7o0YnLRj",
    ]
    for (let i = 0; i < ytListIDs.length; i++){
      var ytURL = "https://www.youtube.com/feeds/videos.xml" +
        "?playlist_id=" + ytListIDs[i];
      this.fetchContent(ytURL, 'video', "Youtube");
    }
    this.state.loaded = true;
  }

  getSources(){
    try {
      var badkarma = AsyncStorage.getItem('badkarma', (value) => {
                  JSON.parse(value)
      });
      if (badkarma == null){
        badkarma = 0;
      };
      var goodkarma = AsyncStorage.getItem('goodkarma', (value) => {
    JSON.parse(value) // boolean false
});
      if (goodkarma == null){
        goodkarma = 0;
      };
      var ratio = badkarma/goodkarma;
    } catch (error) {
      ratio = 1;
    }
    var a = Object.keys(SourceOptions);
    var good = [];
    var bad = [];
    for (i = 0; i < a.length; i++){
      let key = a[i];
      let temp = AsyncStorage.getItem(key, (value) => {
    JSON.parse(value) // boolean false
});
      if (temp == null){
        good.push(key);
      } else {
        bad.push(key);
      }
    };
    return bad;
  }

  parseVideo(s) {
    console.log('Parsing the feed...');
    var doc = new DOMParser().parseFromString(s, 'text/xml');
    var objs = [];
    var entries = doc.getElementsByTagName('entry');
    var videos = doc.getElementsByTagName('yt:videoId');
    var thumbs = doc.getElementsByTagName('media:thumbnail');
    for (var i=0; i < videos.length; i++) {
      objs.push({
        id: videos[i].textContent,
        thumbnail: thumbs[i].getAttribute('url'),
        title: entries[i].getElementsByTagName('title')[0].textContent
      })
    }
    var combined = this.state.videos.concat(objs);
    this.setState({videos: combined});
  }

  fetchNewsApi(source, key) {
    let base = "https://newsapi.org/v1/articles?source=";
    let sort = "&sortBy="
    let method = "top" //top, latest, popular
    let bridge = "&apiKey=";
    let apiKey = "cc76455c24934e7aa3cffcfbaff35112";
    let fetchURL = base + source + sort + method + bridge + apiKey;
    return fetch(fetchURL)
      .then((response) => response.json())
      .then((responseJson) => {
        this.combNews(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  combNews(json){
    var array = json.articles;
    var objs = [];
    for (i = 0; i < array.length; i++){
      objs.push({
        author: array[i].author,
        headline: array[i].title,
        description: array[i].description,
        thumbnail: array[i].urlToImage,
        date: array[i].publishedAt,
        link: array[i].url
      });
    }
    var combined = this.state.news.concat(objs);
    this.setState({news: combined});
  }

  fetchContent(url, type, author) {
    console.log('Fetching content...');
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        console.log("Feed successfully fetched");
        if (type == 'news'){
          this.parseNews(responseText, author);
        } else if (type == 'video'){
          this.parseVideo(responseText);
        }
      })
      .catch((error) => {
        console.log('Error fetching the feed: ', error);
      });
  }

  constructVideo(video){
    return (
      <View style = {{height: 165, width: 0.8*Dimensions.get('window').width}}>
        <TouchableOpacity onPress={() => this.onPressVideo(video.id)}>
          <Image
            source={{uri: video.thumbnail}}
            style={{height: 165}}
            resizeMode={Image.resizeMode.cover}
          >
            <View style = {{flex: 1, backgroundColor: 'rgba(0,0,0,.3)'}}>
              <Text style={localStyleSheet.imageTitle}>{video.title}</Text>
            </View>
          </Image>
        </TouchableOpacity>
      </View>
    );
  }

  onPressVideo(videoID) {
    try {
      var value = AsyncStorage.getItem('goodkarma', (value) => {
    JSON.parse(value) // boolean false
});
      if (value == null){
        value = 0;
      }
      AsyncStorage.setItem('goodkarma',  JSON.stringify(value + 1));
    } catch (error) {
      // Error saving data
    }
    console.log('Pressed video: ', videoID);
      this.props.navigator.push({
        name: 'player',
        videoID: videoID,
        index: 3
    });
  }

  constructArticle(article){
    let organization = article.author;
    let headline = article.headline;
    let description = article.description;
    let date = article.date;
    let thumbnail = article.thumbnail;
    let padding = 5;
    let articleHeight = 150;
    let articleView =
      <TouchableOpacity style = {{alignSelf: 'center', alignItems: 'center',
                                width: 0.9*Dimensions.get('window').width,
                                height: articleHeight, backgroundColor: '#0000000'}} onPress={() => this.onPressArticle(article)}>
        <Image source={{uri: thumbnail}} style = {{width: 0.85*Dimensions.get('window').width, height: articleHeight}}>
          <View style = {{flex: 1, justifyContent:'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.5)'}}>
              <Text style = {localStyleSheet.organization}>{organization}</Text>
              <Text style = {localStyleSheet.headline}>{headline}</Text>
              <Text style = {localStyleSheet.description}>{description}</Text>
              <Text style = {localStyleSheet.date}>{date}</Text>
          </View>
        </Image>
        <View style = {{height: padding}}/>
      </TouchableOpacity>;
    return articleView;
  }

  onPressArticle(article){
    // <Text style = {localStyleSheet.description}>{thumbnail}</Text>
    // Thumbnail link here
    try {
      var value = AsyncStorage.getItem('goodkarma', (value) => {
    JSON.parse(value) // boolean false
});
      if (value == null){
        value = 0;
      }
      AsyncStorage.setItem('goodkarma', JSON.stringify(value + 1));
    } catch (error) {
      // Error saving data
    }
  }

  getRows(numRows){
    let array = [];
    var undisplayedVideos = this.state.videos.slice(0);
    var undisplayedNews = this.state.news.slice(0);
    if (numRows > undisplayedNews.length + undisplayedVideos.length){
      numRows = undisplayedNews.length + undisplayedVideos.length;
    }
    for (i = 0; i < numRows; i++){
      let contentType = Math.floor(Math.random()*5);
      if (contentType == 0 && undisplayedVideos.length){
        let index = Math.floor(Math.random()*undisplayedVideos.length);
        let randomVideo = undisplayedVideos[index];
        undisplayedVideos.splice(index, 1);
        array.push(this.constructVideo(randomVideo));
      } else if (undisplayedNews.length) {
        let index = Math.floor(Math.random()*undisplayedNews.length);
        let randomArticle = undisplayedNews[index];
        undisplayedNews.splice(index, 1);
        array.push(this.constructArticle(randomArticle));
      } else {
        continue;
        let randomArticle = {author: "Wired", headline: "headline", description: "description", date: "date"};
        array.push(this.constructArticle(randomArticle));
      }
    }
    return array;
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
    if (!this.state.loaded){
      return (
        <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            animating={this.state.animating}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
        </View>
      );
    } else {
        return (
          <View style = {{flex: 1, maxHeight: 0.9*Dimensions.get('window').height, maxWidth: 0.9*Dimensions.get('window').width}}>
              <ListView
                dataSource={ds.cloneWithRows(this.getRows(25))}
                renderRow={(rowData) => <View style={{alignSelf: 'center'}}>{rowData}</View>}
                renderSeparator={this.renderSeparator}
              />
          </View>
        );
    }
  }

  renderSeparator(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean)
    {
    return (
      <View
        key={"SEP_" + sectionID + "_" + rowID}
        style = {[localStyleSheet.rowSeperator, adjacentRowHighlighted && localStyleSheet.rowSeperatorHighlighted]}
      />
    )
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
}, Learn);
