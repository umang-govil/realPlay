var express = require('express');

var youtube = require('./youtube');

var api = express.Router();

api.get('/getSong/:vidId', youtube.getSong);

module.exports = api;
