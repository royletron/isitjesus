var mongoose = require('mongoose'),
  _ = require('underscore'),
  Article = mongoose.model('Article'),
  Vote = mongoose.model('Vote');

exports.vote = function(req, res){
  Article.random(function(err, article) {
    res.render('home/vote', {
      title: 'Vote',
      user: req.user,
      article: article
      })
    });
}

exports.post_vote = function(req, res){
  var ans = true
  if(req.params.vote == 'no')
    ans = false
  var user = 'mystery'
  if(req.user)
    user = req.user._id
  Vote.create({user: user, article: req.params.article, vote: ans }, function(err, result){
    if(err) throw new Error('Problem casting vote');
    Article.findOne({_id: req.params.article}, function(err, article){
      if(err) throw new Error('Problem finding article after casting vote');
      if(article)
        Vote.find({article: article._id}, function(err, votes){
          if(err) throw new Error('Problem finding cast votes on article');
          results = _.groupBy(votes, function(vote){ return vote.vote })
          results = {true: results.true ? results.true.length : 0, false: results.false ? results.false.length : 0}
          console.log(results);
          res.render('home/post_vote', {
            title: 'Votes for #article.name',
            user: req.user,
            article: article,
            results: results,
            your_vote: req.params.vote
          })
        })
      else
        res.redirect('/404');
    })
  })
}

exports.index = function(req, res){
  res.render('home/index', {
    title: 'Home',
    user: req.user
  });
};

exports.upload = function(req, res){
  res.render('home/upload', {
    title: 'Upload new entry',
    user: req.user
  })
}

exports.save = function(req, res){
  if((req.body.title == "") || (req.body.image == ""))
  {
    if(req.body.title == "")
      res.json({'status': 'error', 'message': 'missing title'})
    if(req.body.image == "")
      res.json({'status': 'error', 'message': 'missing image'})
  }
  else{
    Article.create({title: req.body.title, image: req.body.image, user: req.user._id}, function(err, result){
      if(err) throw new Error('Problems with creating an article');
      console.log(result);
      res.json({'status': 'success', result: result});
    })
  }
}

exports.show = function(req, res){
  Article.findOne({_id: req.params.id}, function(err, article){
    if(err) throw new Error('Problems finding the article');
    if(article)
      res.render('home/show',{
        title: article.title,
        image: article.image,
        user:req.user
      });
    else
      res.render('404');
  });
}

exports.profile = function(req, res){
  Article.find({user: req.user._id}, function(err, articles){
    if(err) throw new Error('Problems finding the users articles');
    console.log(req.user);
    console.log(articles);
    res.render('home/profile', {
      title: req.user.name,
      articles: articles,
      user: req.user
    })
  })
}