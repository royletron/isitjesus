var passport = require('passport');

module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	app.get('/', home.index);
  app.get('/upload', ensureAuthenticated, home.upload)
  app.post('/upload', ensureAuthenticated, home.save)
  app.get('/uploads/:id', ensureAuthenticated, home.show)
  app.get('/profile', ensureAuthenticated, home.profile)
  app.get('/vote', home.vote)
  app.get('/post_vote/:article/:vote', home.post_vote)

  app.get('/auth/twitter',
    passport.authenticate('twitter'),
    function(req, res){
      // The request will be redirected to Twitter for authentication, so this
      // function will not be called.
    });

  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
  }

};
