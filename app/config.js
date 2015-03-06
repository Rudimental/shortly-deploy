var mongoose = require('mongoose');

//conncect to database or connect to local database
mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/shortlydb';
//connect mongoose to the URI.
mongoose.connect(mongoURI);

//Run in separate terminal window using 'mongod'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Open's only once when database is open
db.once('open', function(){
  console.log('Mongodb connection open');
});

module.exports = db;
