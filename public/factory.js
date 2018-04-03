app.factory('factory', ['$http', function($http) {

	var url = 'http://localhost:3000/api/';
	var youtubeApi = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=';

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
			$http.get(youtubeApi + data + '&key=AIzaSyAupB3bvP4KZB7xL8zbKBC9jZlTVbysJaA')
				.then(function(success) {
					callback(success);
				}, function(error) {
					callback(error);
				});
		}
	};
}]);
