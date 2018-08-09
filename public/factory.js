playlistApp.factory('factory', ['$http', function($http) {

	var url = 'http://localhost:3000/api/';
	var youtubeApi = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=';
	var searchYoutubeApi = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&q=';

	return {
		getSong: function(data, callback) {
			console.log('calling getSONG');
			$http.get(url + 'getSong/' + data)
				.then(function(success) {
					callback(success);
				}, function(error) {
					callback(error);
				});
		},
		fetchSongDetails: function(data, callback) {
			$http.get(youtubeApi + data + '&key=' + process.env.API_KEY)
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
			$http.get(searchYoutubeApi + data + '&key=AIzaSyBY2NVg4Gzrhn1PN0kfZaCliNs_OiZlBPU')
				.then(function(success) {
					callback(success);
				}, function(error) {
					callback(error);
				});
		}
	};
}]);
