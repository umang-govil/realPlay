var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PlaylistSchema = new Schema({
	name: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	songDetails: [{
		songTitle: {
			type: String,
			required: true,
			default: null
		},
		songId: {
			type: String,
			required: true,
			default: null
		}
	}]
}, {
	timestamps: true
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
