var app = angular.module('playlistApp', []);


app.controller('app', ['$scope', 'factory', function($scope, factory) {

	$scope.image = 'pic2.png';

	$scope.playlist = [];

	var baseUrl = 'http://localhost:3000/api/getSong/';
	$('#loader').hide();
	var socket = io.connect('http://localhost:3000');

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

	var runSong = function(youtubeVideoId) {
		$('#mediaPlayer').hide();
		$('#loader').show();
		var audio = document.getElementById('media');

		factory.getSong(youtubeVideoId, function(response) {
			/*console.log(response);
			$('#mediaPlayer').show();
			$('#loader').hide();
			runSong(baseUrl, youtubeVideoId);*/
		});

		factory.fetchSongDetails(youtubeVideoId, function(response1) {

			var details = response1.data.items[0].snippet;
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
		audio.play();
	};

	$scope.add = function() {

		var youtubeVideoUrl = $('#message').val();
		var youtubeVideoId = youtubeVideoUrl.split('v=')[1];
		var ampersandPosition = youtubeVideoId.indexOf('&');
		if (ampersandPosition != -1) {
			youtubeVideoId = youtubeVideoId.substring(0, ampersandPosition);
		}

		// console.log(youtubeVideoId);
		var index = $scope.playlist.findIndex(song => song.videoId == youtubeVideoId);
		if (index === -1) {
			factory.fetchSongDetails(youtubeVideoId, function(response1) {
				console.log(response1);

				var details = response1.data.items[0].snippet;
				// var imageUrl = details.thumbnails.medium.url;
				var titleDetail = details.title;

				var songObject = {
					title: titleDetail,
					videoId: youtubeVideoId,
				};
				// if ($scope.playlist.length === 0) {
				$scope.playlist.push(songObject);
				$('#id-' + youtubeVideoId).ready(function() {
					$('#id-' + youtubeVideoId).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
				});
				// }
				socket.emit('addPlay',
					songObject
				);
			});

			runSong(youtubeVideoId);
		}
	};

	$scope.queue = function() {
		var vidUrl = $('#message').val();

		var id = vidUrl.split('v=')[1];
		var ampPos = id.indexOf('&');
		if (ampPos != -1) {
			id = id.substring(0, ampPos);
		}

		factory.fetchSongDetails(id, function(response2) {
			var details = response2.data.items[0].snippet;

			var queueObject = {
				videoId: id,
				title: details.title
			};

			var index = $scope.playlist.findIndex(song => song.videoId == id);
			if (index === -1) {
				$scope.playlist.push(queueObject);
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

		var currentSong = $('#curr').parent('li').attr('id');
		var currentSong1 = currentSong.split('-');
		var currentSongId = currentSong1[1];
		console.log(currentSongId);
		var index = $scope.playlist.findIndex(song => song.videoId == currentSongId);
		if ($scope.playlist[index + 1]) {
			var nextSongId = $scope.playlist[index + 1].videoId;
			runSong(nextSongId);
			var previousSongId = $scope.playlist[index].videoId;
			$('#id-' + previousSongId).ready(function() {
				$('#id-' + previousSongId).children('span').remove();
			});
			$('#id-' + nextSongId).ready(function() {
				$('#id-' + nextSongId).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
			});
		}
	});

	$scope.next = function() {
		var currentSong = $('#curr').parent('li').attr('id');
		var currentSong1 = currentSong.split('-');
		var currentSongId = currentSong1[1];
		var index = $scope.playlist.findIndex(song => song.videoId == currentSongId);
		console.log(index);
		var length = $scope.playlist.length;
		if ($scope.playlist[(index + 1) % length]) {
			var nextSongId = $scope.playlist[(index + 1) % length].videoId;
			runSong(nextSongId);
			var previousSongId = $scope.playlist[(index) % length].videoId;
			$('#id-' + previousSongId).ready(function() {
				$('#id-' + previousSongId).children('span').remove();
			});
			$('#id-' + nextSongId).ready(function() {
				$('#id-' + nextSongId).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
			});
		}
	};

	$scope.prev = function() {
		var currentSong = $('#curr').parent('li').attr('id');
		var currentSong1 = currentSong.split('-');
		var currentSongId = currentSong1[1];
		var index = $scope.playlist.findIndex(song => song.videoId == currentSongId);
		var length = $scope.playlist.length;
		if ($scope.playlist[index - 1]) {
			var prevSongId = $scope.playlist[index - 1].videoId;
			runSong(prevSongId);
			var nextSongId = $scope.playlist[index].videoId;
			$('#id-' + nextSongId).ready(function() {
				$('#id-' + nextSongId).children('span').remove();
			});
			$('#id-' + prevSongId).ready(function() {
				$('#id-' + prevSongId).append('<span id="curr" class="new badge" data-badge-caption="current"></span>');
			});
		}
	};

}]);
