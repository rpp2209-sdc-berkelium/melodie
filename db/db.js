import mongoose from 'mongoose';
const { Schema } = mongoose;

const qaSchema = new Schema({
  product_id: Number,
  results: [{
    question_id: Number,
    question_body: String,
    question_date: Date,
    question_helpfulness: Number,
    reported: Boolean
    answers: {
      id: { //how to make dynamic ???
        id: Number,
        body: String,
        date: Date,
        answerer_name: String,
        helpfulness: Number,
        photos: [{
          id: Number,
          url: String
        }]
      }
    }
  }]
});

// const answerSchema = new Schema({
//   question_id: Number,
//   answer_id: Number,
//   body: String,
//   date: Date,
//   answerer_name: String,
//   helpfulness: Number
// });

// const photoSchema = new Schema({
//   answer_id: Number,
//   id: Number,
//   url: String
// });

const