const { getQuestions, getAnswers} = require('../db/db.js');

getAnswers("5", function (res) {
  console.log('res', res)
});