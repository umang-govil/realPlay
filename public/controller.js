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

	var runSong = function(baseUrl, youtubeVideoId) {
		var audio = document.getElementById('media');
		audio.setAttribute('src', baseUrl + youtubeVideoId);
		audio.load();
		audio.play();
	};

	var setDetails = function(imageUrl, titleDetail) {
		$scope.title = titleDetail;
		$scope.image = imageUrl;
	};

	$scope.add = function() {

		var youtubeVideoUrl = $('#message').val();
		var youtubeVideoId = youtubeVideoUrl.split('v=')[1];
		var ampersandPosition = youtubeVideoId.indexOf('&');
		if (ampersandPosition != -1) {
			youtubeVideoId = youtubeVideoId.substring(0, ampersandPosition);
		}

		console.log(youtubeVideoId);
		$('#mediaPlayer').hide();
		$('#loader').show();

		factory.fetchSongDetails(youtubeVideoId, function(response1) {
			console.log(response1);
			var details = response1.data.items[0].snippet;
			var imageUrl = details.thumbnails.medium.url;
			var titleDetail = details.title;

			setDetails(imageUrl, titleDetail);

			var songObject = {
				title: titleDetail,
				videoId: youtubeVideoId,
			};
			// if ($scope.playlist.length === 0) {
			$scope.playlist.push(songObject);
			// }
			socket.emit('addPlay',
				songObject
			);
		});

		factory.getSong(youtubeVideoId, function(response) {
			console.log(response);
			$('#mediaPlayer').show();
			$('#loader').hide();
			runSong(baseUrl, youtubeVideoId);
		});


		/*var data1 = $('#message').val();
		$('#mess1').append('<br><b>' + data1 + '</b><br>');
		$('#message').val('');
		return false;*/
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

			$scope.playlist.push(queueObject);
			socket.emit('addPlay',
				queueObject
			);
		});

	};
}]);
