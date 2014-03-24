var mongoose = require('mongoose'),
  Article = mongoose.model('Article');

exports.index = function(req, res){
  res.render('home/index', {
    title: 'Generator-Express MVC',
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