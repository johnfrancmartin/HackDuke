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
var karmaCheck = require('./karmaCheck');
var sourceFinder = require('./getSources');

var Swipeout = require('react-native-swipeout');
var swipeoutBtns = [
  {
    text: 'Save',
    backgroundColor: '#00cc66',
    color: '#ffffff', // textColor
    // onPress: (), // Action On Pressed
    type: 'default', // default, primary, secondary
    underlayColor: '#ffffff', // Underlay Color on press
  },
  {
    text: 'Remind Me',
    backgroundColor: '#ffcc00',
    color: '#ffffff', // textColor
    // onPress: (), // Action On Pressed
    type: 'primary', // default, primary, secondary
    underlayColor: '#ffffff', // Underlay Color on press
  },
  {
    text: 'Delete',
    backgroundColor: '#ff3300',
    color: '#ffffff', // textColor
    // onPress: (), // Action On Pressed
    type: 'secondary', // default, primary, secondary
    underlayColor: '#ffffff', // Underlay Color on press
  },
]
var articleHeight = 150;



class Focus extends Component {

  constructor(props) {
    super(props);
    this.state = {loaded: false, videos: [], news: [], undisplayedVideos: [], undisplayedNews: []}
  }

  async componentWillMount(){
    var sourceChoices = await sourceFinder.getSources("good");
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

  fetchNewsApi(source) {
    let base = "https://newsapi.org/v1/articles?source=";
    let sort = "&sortBy=";
    let sourceCode = source[0];
    let method = source[1]; //top, latest, popular
    let bridge = "&apiKey=";
    let apiKey = "cc76455c24934e7aa3cffcfbaff35112";
    let fetchURL = base + sourceCode + sort + method + bridge + apiKey;
    https://newsapi.org/v1/articles?source=bbc-sport&sortBy=latest&apiKey=cc76455c24934e7aa3cffcfbaff35112
    return fetch(fetchURL)
      .then((response) => response.json())
      .then((responseJson) => {
        this.combNews(responseJson, source[2]);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  combNews(json, organization){
    var array = json.articles;
    var objs = [];
    if (array != null){
      for (i = 0; i < array.length; i++){
        objs.push({
          author: array[i].author,
          source: organization,
          headline: array[i].title,
          description: array[i].description,
          thumbnail: array[i].urlToImage,
          date: array[i].publishedAt,
          link: array[i].url
        });
      }
      var combined = this.state.news.concat(objs);
      this.setState({news: combined});
    } else {
      console.log(organization);
    }
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
        <View style = {{height: 165, width: 0.85*Dimensions.get('window').width}}>
          <Swipeout right={swipeoutBtns} style={{width: 0.9*Dimensions.get('window').width, height:articleHeight}}>
            <TouchableOpacity onPress={() => this.onPressVideo(video.id)}>
              <Image
                source={{uri: video.thumbnail}}
                style={{height: 165, borderRadius: 3}}
                resizeMode={Image.resizeMode.cover}
              >
                <View style = {{flex: 1, backgroundColor: 'rgba(0,0,0,.3)',borderRadius: 3}}>
                  <Text style={localStyleSheet.imageTitle}>{video.title}</Text>
                </View>
              </Image>
            </TouchableOpacity>
          </Swipeout>
        </View>
    );
  }

  onPressVideo(videoID) {
    console.log('Pressed video: ', videoID);
    if (this.state.currentView == 'focus'){
      this.incrementKarma('badkarma');
    } else if (this.state.currentView == 'learn'){
      this.incrementKarma('goodkarma');
    }
    this.props.navigator.push({
        name: 'player',
        videoID: videoID,
        index: 3
    });
  }

  async incrementKarma(){
    // add qualifier for good/badkarma
    try {
      var value =  await AsyncStorage.getItem('goodkarma');
      if (value == null){
        value = 0;
      } else {
        value = parseInt(value);
      }
      await AsyncStorage.setItem('goodkarma', (value + 1).toString());

    } catch (error) {
      // Error saving data
    }
  }

  constructArticle(article){
    let author = article.author;
    let headline = article.headline;
    let description = article.description;
    let date = article.date;
    let thumbnail = article.thumbnail;
    let source = article.source;
    let padding = 5;
    let articleView =
      <View style = {{alignSelf: 'center', alignItems: 'center',
                                  width: 0.9*Dimensions.get('window').width,
                                  height: articleHeight, backgroundColor: '#0000000'}}>
          <Swipeout right={swipeoutBtns} style={{width: 0.9*Dimensions.get('window').width, height:articleHeight}}>
            <TouchableOpacity onPress={() => this.onPressArticle(article)}>
              <Image source={{uri: thumbnail}} style = {{width: 0.85*Dimensions.get('window').width, height: articleHeight, borderRadius: 3,}}>
              <View style = {{flex: 1, justifyContent:'center', borderRadius: 3, alignItems: 'center', backgroundColor: 'rgba(0,0,0,.5)'}}>
                  <Text style = {localStyleSheet.organization}>{source}</Text>
                  <Text style = {localStyleSheet.headline}>{headline}</Text>
                  <Text style = {localStyleSheet.description}>{description}</Text>
                  <Text style = {localStyleSheet.date}>{date}</Text>
              </View>
            </Image>
            <View style = {{height: padding}}/>
          </TouchableOpacity>
        </Swipeout>
      </View>
    return articleView;
  }

  onPressArticle(article){
    if (this.state.currentView == 'focus'){
      this.incrementKarma('badkarma');
    } else if (this.state.currentView == 'learn'){
      this.incrementKarma('goodkarma');
    }
    let urlString = article.link;
    if (urlString.substring(0, 5) == "http:"){
      tempURL = urlString.slice(7, urlString.length);
      urlString = "https://" + tempURL;
    }
    this.props.navigator.push({
        name: 'article',
        url: urlString,
        index: 4
    });
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
    fontSize: 16,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0)',
    textAlign: 'center',
    marginBottom: 2,
    marginLeft: 3,
    marginVertical: 3,
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
}, Focus);
