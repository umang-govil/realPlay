var express = require('express');
var path = require('path');
var fs = require('fs');

var youtubeStream = require('youtube-audio-stream');
var ytdl = require('ytdl-core');

var api = express.Router();

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

module.exports = api;
