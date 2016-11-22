var sourceMatching = require('./SourceOptions');

module.exports = function findSources(tastes){
    var keys = Object.keys(sourceMatching);
    var sources = [];
    for (i = 0; i < tastes.length; i++){
      for (j = 0; j < keys.length; j++){
        if (tastes[i] == keys[j].toString())
        sources.push(sourceMatching.keys[j]);
      }
    }
    return sources;
}
