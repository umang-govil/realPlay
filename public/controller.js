var app = angular.module('playlistApp', []);

app.controller('app', ['$scope', 'factory', function($scope, factory) {

	var baseUrl = 'http://localhost:3000/api/getSong/';
	$('#loader').hide();
	// var socket = io.connect('http://localhost:3000');
	$scope.send = function() {
		var youtubeVideoId = $('#message').val();
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
			console.log(response1.data.items[0].snippet.title);
		});
		/*socket.emit('addPlay',
			$('#message').val()
		);
		var data1 = $('#message').val();
		$('#mess1').append('<br><b>' + data1 + '</b><br>');
		$('#message').val('');
		return false;*/
	};

	/*socket.on('msg', function(data) {
		console.log(data);
		$('#mess2').append('<br><b>' + data + '</b><br>');
	});*/


}]);
