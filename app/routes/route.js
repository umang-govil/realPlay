var express = require('express');

var youtube = require('./youtube');

var api = express.Router();

api.get('/getSong/:vidId', youtube.getSong);
api.get('/getPlaylist/:name', youtube.getPlaylist);
api.post('/createPlaylist', youtube.createPlaylist);
api.post('/addSong', youtube.addSong);
api.get('/fetchSongDetails/:id', youtube.fetchSongDetails);
api.get('/searchSongs/:q', youtube.searchSongs);

module.exports = api;
