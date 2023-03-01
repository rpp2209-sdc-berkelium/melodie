const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/qa');

const questionSchema = new Schema({
  product_id: Number,
  results: [{
    question_id: Number,
    question_body: String,
    question_date: Date,
    question_helpfulness: Number,
    reported: Boolean
  }]
});

const answerSchema = new Schema({
  question_id: Number,
  answer_id: Number,
  body: String,
  date: Date,
  answerer_name: String,
  helpfulness: Number
});

const photoSchema = new Schema({
  answer_id: Number,
  id: Number,
  url: String
});

const Questions = mongoose.model('Questions', questionSchema);
const Answers = mongoose.model('Answers', answerSchema);
const Photos = mongoose.model('Questions', photoSchema);

