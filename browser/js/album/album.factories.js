juke.factory('StatsFactory', function ($q) {
  var statsObj = {};
  statsObj.totalTime = function (album) {
    //console.log('album: ',album);
    var audio = document.createElement('audio');
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;
      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;

        //console.log('n and sum: ', n, ' ', sum);
      }
      audio.addEventListener('loadedmetadata', function () {
        //console.log('got event');
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    });
  };
  return statsObj;
});

juke.factory('AlbumFactory', function($http){
  var albumFactory = {};

  albumFactory.fetchAll = function()
  {
    return $http.get('/api/albums/')
    .then(function (res) { console.log(res.data); return res.data; });
  };

  albumFactory.fetchById = function(id)
  {
    return $http.get('/api/albums/' + id)
    .then(function (res) { return res.data; });
  };

  return albumFactory;

});