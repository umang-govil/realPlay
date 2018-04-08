var app = angular.module('playlistApp', []);

app.controller('app', ['$scope', 'factory', function($scope, factory) {

	$scope.image = 'pic2.png';

	$scope.playlist = [];
	var songObject = {
		title: '',
		videoId: '',
	};

	var baseUrl = 'http://localhost:3000/api/getSong/';
	$('#loader').hide();
	// var socket = io.connect('http://localhost:3000');
	$scope.add = function() {

		var youtubeVideoUrl = $('#message').val();
		var youtubeVideoId = youtubeVideoUrl.split('v=')[1];
		var ampersandPosition = youtubeVideoId.indexOf('&');
		if (ampersandPosition != -1) {
			youtubeVideoId = youtubeVideoId.substring(0, ampersandPosition);
		}
		console.log(youtubeVideoId);

		songObject.videoId = youtubeVideoId;

		console.log(youtubeVideoId);
		$('#mediaPlayer').hide();
		$('#loader').show();
		factory.getSong(youtubeVideoId, function(response) {
			console.log(response);
			$('#mediaPlayer').show();
			$('#loader').hide();
			var audio = document.getElementById('media');
			audio.setAttribute('src', baseUrl + youtubeVideoId);
			audio.load();
			audio.play();
		});

		factory.fetchSongDetails(youtubeVideoId, function(response1) {
			var details = response1.data.items[0].snippet;
			$scope.image = details.thumbnails.medium.url;
			$scope.title = details.title;

			songObject.title = details.title;
			if ($scope.playlist.length === 0) {
				$scope.playlist.push(songObject);
			}

			console.log(details.thumbnails);
			console.log(details.title);
		});
		/*socket.emit('addPlay',
			$('#message').val()
		);
		var data1 = $('#message').val();
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
		});

	};

	/*socket.on('msg', function(data) {
		console.log(data);
		$('#mess2').append('<br><b>' + data + '</b><br>');
	});*/


}]);
