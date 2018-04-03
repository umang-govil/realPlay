var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 3000;
var path = require('path');

var cors = require('cors');

var app = express();

app.use(cors());

module.exports = app;

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

var api = require('./app/routes/route');
app.use('/api', api);

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send(err);
});

var server = app.listen(port, function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Listening on port ' + port);
	}
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
	console.log('New User Connected');
	socket.on('addPlay', function(data) {
		console.log(data);
		socket.broadcast.emit('msg', data);
	});
});
