/* global juke */
'use strict';

juke.controller('PlayerCtrl', function ($scope, $rootScope, PlayerFactory, AlbumFactory) {

  // initialize audio player (note this kind of DOM stuff is odd for Angular)
  var audio = document.createElement('audio');
  audio.addEventListener('ended', function () {
    $scope.next();
    // $scope.$apply(); // triggers $rootScope.$digest, which hits other scopes
    $scope.$evalAsync(); // likely best, schedules digest if none happening
  });
  audio.addEventListener('timeupdate', function () {
    $scope.progress = 100 * audio.currentTime / audio.duration;
    // $scope.$digest(); // re-computes current template only (this scope)
    $scope.$evalAsync(); // likely best, schedules digest if none happening
  });

  // state
  $scope.currentSong;

  $scope.playing = false;
  PlayerFactory.playing = false;

  $scope.showFooter = function()
  {
    return PlayerFactory.currentSong;
  }

  $scope.isPlaying = function(){
    return PlayerFactory.isPlaying();
  }

  $scope.getCurrentSong = function(){
    return PlayerFactory.getCurrentSong();
  }
  // main toggle
  $scope.toggle = function () {
    // if ($scope.playing) $rootScope.$broadcast('pause');
    // else $rootScope.$broadcast('play', song);
    console.log('ss');
    if(PlayerFactory.playing) PlayerFactory.pause();
    else {
      console.log (PlayerFactory.songList);
      PlayerFactory.start($scope.getCurrentSong());

      //$scope.currentSong=PlayerFactory.currentSong;
    };

  };

 

  // incoming events (from Album or toggle)
  // $scope.$on('pause', PlayerFactory.pause);
  // $scope.$on('play', play);
    // .then(function(result){
     //$scope.currentSong = result.currentSong;
    //   $scope.playing = result.playing;
    // });

  // functionality
  function pause () {
    audio.pause();
    PlayerFactory.playing = false;
    $scope.playing = false;
  }
  function play (event, song){
    // stop existing audio (e.g. other song) in any case
    pause();
    PlayerFactory.playing = true;
    $scope.playing = true;
    // resume current song
    if (song === $scope.currentSong) return audio.play();
    // enable loading new song
    $scope.currentSong = song;
    audio.src = song.audioUrl;
    audio.load();
    audio.play();
  }

  // outgoing events (to Album… or potentially other characters)
  $scope.next = function () { pause(); $rootScope.$broadcast('next'); };
  $scope.prev = function () { pause(); $rootScope.$broadcast('prev'); };

  function seek (decimal) {
    audio.currentTime = audio.duration * decimal;
  }

  $scope.handleProgressClick = function (evt) {
    seek(evt.offsetX / evt.currentTarget.scrollWidth);
  };

});
