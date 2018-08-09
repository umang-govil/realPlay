var playlistApp = angular.module('playlistApp', ['ngRoute']);

playlistApp.config(function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider
		.when('/', {
			templateUrl: 'home.html',
			controller: 'mainController'
		})
		.when('/main/:id', {
			templateUrl: 'main.html',
			controller: 'playlistController'
		})
		.otherwise({
			redirectTo: '/'
		});
});


playlistApp.controller('playlistController', function($scope, $location, factory) {

	$scope.image = 'pic2.png';

	$scope.playlist = [];
	// $scope.searches = [];

	var playlistTitle = $location.path().split('/').pop();
	factory.getPlaylist(playlistTitle, function(response) {
		$scope.found = response.data;
		if ($scope.found.found) {
			$scope.found.songDetails.forEach(function(song) {
				var pushSong = {
					title: song.songTitle,
					videoId: song.songId,
					_id: song._id
				};
				$scope.playlist.push(pushSong);
			});
		} else if ($scope.found.found === false) {
			$location.path('/');
		}
	});

	var baseUrl = 'https://sharemymusic.herokuapp.com/api/getSong/';
	$('#loader').hide();
	var socket = io.connect('https://sharemymusic.herokuapp.com/');

	socket.on('msg', function(data) {
		$scope.$apply(function() {
			$scope.playlist.push(data);
			console.log($scope.playlist);
		});
	});

	var setDetails = function(imageUrl, titleDetail) {
		$scope.title = titleDetail;
		$scope.image = imageUrl;
	};

	function runSong(youtubeVideoId) {
		$('#mediaPlayer').hide();
		$('#loader').show();
		var audio = document.getElementById('media');

		/*factory.getSong(youtubeVideoId, function(response) {

		});*/

		factory.fetchSongDetails(youtubeVideoId, function(response1) {

			var details = response1.data.body.items[0].snippet;
			var imageUrl = details.thumbnails.medium.url;
			var titleDetail = details.title;

			setDetails(imageUrl, titleDetail);

			/*var songObject = {
				title: titleDetail,
				videoId: youtubeVideoId,
			};*/
			// if ($scope.playlist.length === 0) {
			// $scope.playlist.push(songObject);
			// }
		});

		audio.setAttribute('src', baseUrl + youtubeVideoId);
		audio.load();
		audio.play();
	}

	$scope.search = function() {
		var searchQuery = $('#message').val();
		factory.searchSongs(searchQuery, function(response) {
			/*console.log(response);
			response.data.items.forEach(function(item) {
				$scope.searches.push(item);
			});*/
			$scope.searches = response.data.body.items;
			console.log($scope.searches);
		});
	};


	$scope.add = function(e) {
		var videoArr = e.target.parentNode.parentNode.id.split('--');
		var youtubeVideoId = videoArr[1];

		// console.log(youtubeVideoId);
		var index = $scope.playlist.findIndex(song => song.videoId == youtubeVideoId);
		if (index === -1) {
			factory.fetchSongDetails(youtubeVideoId, function(response1) {
				console.log(response1);

				var details = response1.data.body.items[0].snippet;
				// var imageUrl = details.thumbnails.medium.url;
				var titleDetail = details.title;

				var songObject = {
					title: titleDetail,
					videoId: youtubeVideoId,
					_id: null
				};
				// if ($scope.playlist.length === 0) {
				$scope.playlist.push(songObject);

				var data = {
					name: playlistTitle,
					title: titleDetail,
					songId: youtubeVideoId
				};

				factory.addSong(data, function(response) {
					var index1 = $scope.playlist.findIndex(song => song.videoId == response.data.songId);
					$scope.playlist[index1]._id = response.data._id;
				});

				$('#id--' + youtubeVideoId).ready(function() {
					$('#id--' + youtubeVideoId).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
				});
				// }
				socket.emit('addPlay',
					songObject
				);
			});

			runSong(youtubeVideoId);
		}
	};

	$scope.queue = function(f) {
		var videoArr1 = f.target.parentNode.parentNode.id.split('--');
		var id = videoArr1[1];

		factory.fetchSongDetails(id, function(response2) {
			var details = response2.data.body.items[0].snippet;

			var queueObject = {
				videoId: id,
				title: details.title,
				_id: null
			};

			var index = $scope.playlist.findIndex(song => song.videoId == id);
			if (index === -1) {
				$scope.playlist.push(queueObject);
				var data = {
					name: playlistTitle,
					title: details.title,
					songId: id
				};
				factory.addSong(data, function(response) {
					var index1 = $scope.playlist.findIndex(song => song.videoId == response.data.songId);
					console.log(index1);
					$scope.playlist[index1]._id = response.data._id;
				});
				socket.emit('addPlay',
					queueObject
				);
			}
		});
	};

	var audio1 = document.getElementById('media');

	audio1.addEventListener('playing', function(e) {
		$('#mediaPlayer').show();
		$('#loader').hide();
	});

	audio1.addEventListener('ended', function(e) {
		console.log('song ended');
		var currentSong = $('#curr').parent('li').attr('id');
		var currentSong1 = currentSong.split('--');
		var currentSongId = currentSong1[1];
		console.log(currentSongId);
		var index = $scope.playlist.findIndex(song => song.videoId == currentSongId);
		if ($scope.playlist[index + 1]) {
			var nextSongId = $scope.playlist[index + 1].videoId;
			runSong(nextSongId);
			var previousSongId = $scope.playlist[index].videoId;
			$('#id--' + previousSongId).ready(function() {
				$('#id--' + previousSongId).children('span').remove();
			});
			$('#id--' + nextSongId).ready(function() {
				$('#id--' + nextSongId).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
			});
		} else {
			var nextSongId1 = $scope.playlist[0].videoId;
			runSong(nextSongId1);
			var previousSongId1 = $scope.playlist[index].videoId;
			$('#id--' + previousSongId1).ready(function() {
				$('#id--' + previousSongId1).children('span').remove();
			});
			$('#id--' + nextSongId1).ready(function() {
				$('#id--' + nextSongId1).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
			});
		}
	});

	$scope.next = function() {
		var currentSong = $('#curr').parent('li').attr('id');
		var currentSong1 = currentSong.split('--');
		var currentSongId = currentSong1[1];
		var index = $scope.playlist.findIndex(song => song.videoId == currentSongId);
		console.log(index);
		var size = $scope.playlist.length;
		var nextSongId = $scope.playlist[(index + 1) % size].videoId;
		runSong(nextSongId);
		var previousSongId = $scope.playlist[index].videoId;
		$('#id--' + previousSongId).ready(function() {
			$('#id--' + previousSongId).children('span').remove();
		});
		$('#id--' + nextSongId).ready(function() {
			$('#id--' + nextSongId).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
		});
	};

	$scope.prev = function() {
		console.log('hi');
		var currentSong = $('#curr').parent('li').attr('id');
		var currentSong1 = currentSong.split('--');
		var currentSongId = currentSong1[1];
		console.log(currentSongId);
		var index = $scope.playlist.findIndex(song => song.videoId == currentSongId);
		var length = $scope.playlist.length;
		console.log(index);
		if ($scope.playlist[index - 1]) {
			var prevSongId = $scope.playlist[index - 1].videoId;
			runSong(prevSongId);
			var nextSongId = $scope.playlist[index].videoId;
			$('#id--' + nextSongId).ready(function() {
				$('#id--' + nextSongId).children('span').remove();
			});
			$('#id--' + prevSongId).ready(function() {
				$('#id--' + prevSongId).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
			});
		} else if ((index - 1) == -1) {
			var prevSongId1 = $scope.playlist[length - 1].videoId;
			runSong(prevSongId1);
			var nextSongId1 = $scope.playlist[index].videoId;
			$('#id--' + nextSongId1).ready(function() {
				$('#id--' + nextSongId1).children('span').remove();
			});
			$('#id--' + prevSongId1).ready(function() {
				$('#id--' + prevSongId1).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
			});
		}
	};

	$scope.singlePlay = function(event) {

		var field = event.target.parentNode.id.split('--');
		var playSongId = field[1];

		runSong(playSongId);

		if ($('#curr').length) {
			var currentSong = $('#curr').parent('li').attr('id');
			var currentSong1 = currentSong.split('--');
			var currentSongId = currentSong1[1];

			$('#id--' + currentSongId).ready(function() {
				$('#id--' + currentSongId).children('span').remove();
			});
			$('#id--' + playSongId).ready(function() {
				$('#id--' + playSongId).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
			});
		} else {
			$('#id--' + playSongId).ready(function() {
				$('#id--' + playSongId).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
			});
		}
	};

	$scope.clear = function(c) {
		var songArr = c.target.parentNode.id.split('--');
		var songId = songArr[1];
		var index = $scope.playlist.findIndex(song => song.videoId == songId);

		$scope.playlist.splice(index, 1);
	};
});

playlistApp.controller('mainController', function($scope, $location, factory) {
	$scope.createFlag = false;
	$scope.joinFlag = false;

	$scope.create = function() {
		$scope.createFlag = true;
		$scope.label = 'Enter Your Playlist Name : ';
	};
	$scope.join = function() {
		$scope.joinFlag = true;
		$scope.label = 'Enter The Playlist Name : ';
	};

	$scope.inputCreate = function() {
		var createId = $('#inputCreate').val();
		var data = {
			name: createId
		};
		factory.createPlaylist(data, function(response) {
			$scope.success = response.data;
			$scope.taken = response.data.code;
			if ($scope.success.success) {
				$location.path('/main/' + $scope.success.name);
			}
		});
	};

	$scope.inputJoin = function() {
		var joinId = $('#inputJoin').val();

		factory.getPlaylist(joinId, function(response) {
			console.log(response.data);
			$scope.found = response.data;
			if ($scope.found.found) {
				$location.path('/main/' + $scope.found.name);
			}
		});
	};
});
