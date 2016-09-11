/* global juke */
'use strict';

juke.controller('AlbumCtrl', function ($scope, $rootScope, $log, AlbumFactory, StatsFactory, PlayerFactory) {
  // load our initial data
  AlbumFactory.fetchAll()
  .then(function (albums) {
    return AlbumFactory.fetchById(albums[0].id); // temp: get one
  })
  .then(function (album) {
    album.imageUrl = '/api/albums/' + album.id + '/image';
    album.songs.forEach(function (song, i) {
      song.audioUrl = '/api/songs/' + song.id + '/audio';
      song.albumIndex = i;
    });
    $scope.album = album;
    angular.copy(album.songs,PlayerFactory.songList);
    //PlayerFactory.songList = $scope.album.songs;
    console.log ('song list is ', PlayerFactory.songList);
    console.log ($scope.album);
    StatsFactory.totalTime(album)
    .then(function (albumDuration) {
      console.log('got albumDuration ',albumDuration);
      $scope.fullDuration = Math.round(albumDuration,0);
    });
  })
  .catch($log.error); // $log service can be turned on and off; also, pre-bound

  $scope.getDuration = function()
  {
    return $scope.fullDuration;
  }

  $scope.isPlaying = function(){
    return PlayerFactory.isPlaying();
  }

  $scope.isCurrentSong = function(song){
    if (PlayerFactory.getCurrentSong() === null){
      return false;
    }
    console.log('ids: ',song.id, ' ', PlayerFactory.getCurrentSong().id);
    return song.id === PlayerFactory.getCurrentSong().id;
  }


  // main toggle
  $scope.toggle = function (song, songList) {
    // if ($scope.playing && song === $scope.currentSong) {
    //   $rootScope.$broadcast('pause');
    // } else {
    //   $rootScope.$broadcast('play', song);
    //}
 
    if(PlayerFactory.playing) PlayerFactory.pause();
    else PlayerFactory.start(song, songList);
    
  };


  // incoming events (from Player, toggle, or skip)
  //$scope.$on('pause', pause);
  //$scope.$on('play', play);
  //$scope.$on('next', next);
  //$scope.$on('prev', prev);

  // functionality
  // function pause () {
  //   $scope.playing = false;
    
  // }
  // function play (event, song) {
  //   $scope.playing = true;
  //   $scope.currentSong = song;
  // }

  // a "true" modulo that wraps negative to the top of the range
  function mod (num, m) { return ((num % m) + m) % m; }

  // jump `interval` spots in album (negative to go back, default +1)
  function skip (interval) {
    if (!$scope.currentSong) return;
    var index = $scope.currentSong.albumIndex;
    index = mod( (index + (interval || 1)), $scope.album.songs.length );
    $scope.currentSong = $scope.album.songs[index];
    //if (PlayerFactory.isPlaying) $rootScope.$broadcast('play', $scope.currentSong);
  }
  function next () { skip(1); }
  function prev () { skip(-1); }

});

juke.controller('AlbumsCtrl',function($scope,$rootScope,$log,AlbumFactory)
{
  AlbumFactory.fetchAll()
  .then(function(albums){
    $scope.albums = albums;
  });
});
