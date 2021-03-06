var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
  username: { type: String, index: { unique: true }},
  password: String
});


var User = mongoose.model('User', userSchema);

User.comparePassword = function(attemptedPassword, savedPassword, cb) {
  bcrypt.compare(attemptedPassword, savedPassword, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.pre('save', function(next){
  var cipher = Promise.promisify(bcrypt.hash);
  //try removing the this and watch the world burn
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

module.exports = User;
