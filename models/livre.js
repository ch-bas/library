var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Livre = new Schema({
    titre: String,
    description: String,
    _category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
	isbn: Number,
	disponible: Boolean
});

module.exports = mongoose.model('Livres', Livre);