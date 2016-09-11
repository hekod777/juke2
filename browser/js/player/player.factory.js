'use strict';

juke.factory('PlayerFactory', function($http){
  // non-UI logic in here
  var playerFactory = {};
  var audio = document.createElement('audio');

  // var audio = document.createElement('audio');
  playerFactory.playing=false; 
  playerFactory.currentSong = null;
  playerFactory.songList =[];

  var progress = 0;

  playerFactory.start = function(song, songList){
  	playerFactory.pause();
  	console.log('playing');
  	playerFactory.playing = true;
  	if (songList){
  		playerFactory.songList = songList;
  	};
 
  	//angular.copy(songList,PlayerFactory.songList) ;
  	if (song === playerFactory.currentSong) {
  		audio.play();
  		return playerFactory.playing;
  	}

  	// enable loading new song
  	playerFactory.currentSong = song;
  	audio.src = song.audioUrl;
  	audio.load();
  	audio.play();


  }

  playerFactory.pause = function(){
  	audio.pause();
  	playerFactory.playing = false;
  	console.log('pausing');
  	return playerFactory.playing;
  }

  playerFactory.resume = function(){
  	audio.play();
  	playerFactory.playing = true;
  	return playerFactory.playing; // for $scope.playing

  }

  playerFactory.isPlaying = function(){
  	return playerFactory.playing;
  }

  playerFactory.getCurrentSong = function(){
  	return playerFactory.currentSong;
  }

  playerFactory.next = function(){
  	var CurrentSongIdx = playerFactory.songList.indexOf(playerFactory.currentSong);
  	if (CurrentSongIdx == playerFactory.songList.length-1){
  		playerFactory.currentSong = playerFactory.songList[0]; 
  		return playerFactory.start(playerFactory.currentSong,playerFactory.songList);
  	}
  	playerFactory.currentSong = playerFactory.songList[CurrentSongIdx + 1]; 
  	return playerFactory.start(playerFactory.currentSong, playerFactory.songList);

  }

  playerFactory.previous = function(){
  	var CurrentSongIdx = playerFactory.songList.indexOf(playerFactory.currentSong);
  	if (CurrentSongIdx == 0){
  		playerFactory.currentSong = playerFactory.songList[playerFactory.songList.length-1]; 
  		return playerFactory.start(playerFactory.currentSong,playerFactory.songList);
  	}
  	playerFactory.currentSong = playerFactory.songList[CurrentSongIdx - 1]; 
  	return playerFactory.start(playerFactory.currentSong, playerFactory.songList);
  }

  playerFactory.getProgress = function(){
  	// $scope.progress = 100 * audio.currentTime / audio.duration;
  	
  	if (playerFactory.currentSong){
  		progress = audio.currentTime/audio.duration;
  	}
  	return progress;
  	// // $scope.$digest(); // re-computes current template only (this scope)
  	// $scope.$evalAsync(); // likely best, schedules digest if none happening

  }

  return playerFactory;

});
