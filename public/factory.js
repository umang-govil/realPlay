playlistApp.factory('factory', ['$http', function($http) {

	var url = 'https://sharemymusic.herokuapp.com/api/';

	return {
		getSong: function(data, callback) {
			$http.get(url + 'getSong/' + data)
				.then(function(success) {
					callback(success);
				}, function(error) {
					callback(error);
				});
		},
		fetchSongDetails: function(data, callback) {
			$http.get(url + 'fetchSongDetails/' + data)
				.then(function(success) {
					callback(success);
				}, function(error) {
					callback(error);
				});
		},
		createPlaylist: function(data, callback) {
			$http.post(url + 'createPlaylist', data)
				.then(function(success) {
					callback(success);
				}, function(error) {
					callback(error);
				});
		},
		getPlaylist: function(data, callback) {
			$http.get(url + 'getPlaylist/' + data)
				.then(function(success) {
					callback(success);
				}, function(error) {
					callback(error);
				});
		},
		addSong: function(data, callback) {
			$http.post(url + 'addSong/', data)
				.then(function(success) {
					callback(success);
				}, function(error) {
					callback(error);
				});
		},
		searchSongs: function(data, callback) {
			$http.get(url + '/searchSongs/' + data)
				.then(function(success) {
					callback(success);
				}, function(error) {
					callback(error);
				});
		}
	};
}]);
