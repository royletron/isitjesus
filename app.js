var express = require('express'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  config = require('./config/config'), 
  passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy;

var TWITTER_CONSUMER_KEY = "1GCGNbUgb6zz9Y6lexgxA";
var TWITTER_CONSUMER_SECRET = "UT8xwlFjAxnYMCCyZY4xgivTMC9SWz0jXUqvHcuNNZs";

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var User = mongoose.model('User');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the TwitterStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Twitter profile), and
//   invoke a callback with a user object.
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://isitjesus.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      User.findOne({twitter: profile.username.toLowerCase()}, function(err, result){
        if(err) throw new Error('Problem with finding the user from the Twitter profile');
        if(result)
          User.update({_id: result._id}, {twitter: profile.username.toLowerCase(), name: profile.displayName, avatar: profile.photos[0].value}, function(err, success){
            if(err) throw new Error('Problem with updating the user that existed');
            return done(null, result);
          })
        else
          User.create({twitter: profile.username.toLowerCase(), name: profile.displayName, avatar: profile.photos[0].value}, function(err, result){
            if(err) throw new Error('Problem with creating the user from the Twitter details');
            return done(null, result);
          })
      })
    });
  }
));


var app = express();

require('./config/express')(app, config);
require('./config/routes')(app);

app.listen(process.env.PORT || config.port);
