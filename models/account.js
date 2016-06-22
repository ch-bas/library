var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Account = new Schema({
    username: String,
    password: String,
    email: String,
    livres_emp:[{type: mongoose.Schema.Types.ObjectId, ref: 'Livres'}],
	role: Boolean
});
Account.plugin(passportLocalMongoose, {usernameField: "username"});
module.exports = mongoose.model('Account', Account);