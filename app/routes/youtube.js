var express = require('express');
var path = require('path');
var fs = require('fs');
var request = require('request');

var Playlist = require('./playlistSchema');

var youtubeStream = require('youtube-audio-stream');
var ytdl = require('ytdl-core');

var api = express.Router();
var mongoose = require('mongoose');

api.getSong = function(req, res) {
	console.log('hi');
	var videoId = req.params.vidId;
	console.log(videoId);
	var requestUrl = 'http://youtube.com/watch?v=' + videoId;
	console.log(requestUrl);
	try {
		var content = ytdl(requestUrl, {
			filter: 'audioonly',
			quality: 'lowest'
		});
		content.pipe(res);
	} catch (exception) {
		res.status(500).send(exception);
	}
};

api.createPlaylist = function(req, res) {
	var playlist = new Playlist({
		name: req.body.name
	});

	playlist.save(function(err) {
		if (err) {
			res.send(err);
			return;
		} else {
			res.json({
				success: true,
				name: req.body.name,
				message: "Playlist Created !"
			});
		}
	});
};

api.addSong = function(req, res) {
	var playlistName = req.body.name;
	Playlist.findOne({
		name: playlistName
	}, function(err, playlist) {
		if (err) throw err;
		if (!playlist) {
			res.json({
				success: false,
				message: "Playlist Not Found !"
			});
		} else if (playlist) {

			var songObject = {
				songTitle: req.body.title,
				songId: req.body.songId
			};
			playlist.songDetails.push(songObject);
			playlist.save(function(err, data) {
				if (err) throw err;
				else {
					res.json({
						_id: data._id,
						songId: req.body.songId,
						success: true,
						message: "Song added to the playlist !"
					});
				}
			});

		}
	});
};

api.getPlaylist = function(req, res) {
	Playlist.findOne({
		name: req.params.name
	}, function(err, playlist) {
		if (err) throw err;
		if (!playlist) {
			res.json({
				found: false,
				message: "Playlist Not Found !"
			});
		} else if (playlist) {
			res.json({
				success: true,
				found: true,
				name: playlist.name,
				songDetails: playlist.songDetails
			});
		}
	});
};

api.fetchSongDetails = function(req, res) {
	request('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + req.params.id + '&key=' + process.env.API_KEY, {
		json: true
	}, function(err, resp, body) {
		if (err) throw err;
		res.send(resp);
	});
};

api.searchSongs = function(req, res) {
	request('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&q=' + req.params.q + '&key=' + process.env.API_KEY, {
		json: true
	}, function(err, resp, body) {
		if (err) throw err;
		res.send(resp);
	});
};

/*api.deleteSong = function(req, res) {
	Playlist.update({
			name: req.body.title
		}, {
			$pull: {
				"songdetails": {
					"_id": req.body.dbId
				}
			}
		}, {
			multi: true
		},
		function(err) {
			if (err) throw err;
			res.json({
				success: true,
				message: 'Song Removed from the playlist'
			});
		});
};
*/
module.exports = api;
