const express = require('express');
const app = express();
const port = 3000;

const { getQuestions, getAnswers } = require('../db/db.js');

app.use(express.json());

app.get('/qa/questions', (req, res) => {
  var page = req.query.page || 1;
  var count = req.query.count || 5;
  return getQuestions(req.query.product_id, page, count)
  .then((results) => {
    res.status(200).send({
      "product_id": req.query.product_id,
      "results": results
    })
  })
  .catch((err) => {
    res.status(400).send('An error occurred getting questions' + err);
  })
});

app.get('/qa/questions/:question_id/answers', (req, res) => {
  var results = [];
  var page = req.query.page || 1;
  var count = req.query.count || 5;
  return getAnswers(req.params.question_id, function (a) {
    results.push(a)
  }, page, count)
  .then(() => {
    res.status(200).send({
      "question": req.params.question_id,
      "page": req.query.page,
      "count": req.query.count,
      "results": results
    })
  })
  .catch((err) => {
    res.status(400).send('An error occurred getting answers' + err);
  })
});

app.listen(port, () => {
  console.log(`QA service listening on port ${port}`)
});