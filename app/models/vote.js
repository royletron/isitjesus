// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var VoteSchema = new Schema({
  article: String,
  user: String,
  vote: Boolean
});

VoteSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Vote', VoteSchema);
