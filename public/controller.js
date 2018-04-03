var app = angular.module('playlistApp', []);

app.controller('app', function($scope) {

	var socket = io.connect('http://localhost:3000');

	$scope.send = function() {

		socket.emit('addPlay',
			$('#message').val()
		);
		var data1 = $('#message').val();
		$('#mess1').append('<br><b>' + data1 + '</b><br>');
		$('#message').val('');
		return false;
	};

	socket.on('msg', function(data) {
		console.log(data);
		$('#mess2').append('<br><b>' + data + '</b><br>');
	});

});
