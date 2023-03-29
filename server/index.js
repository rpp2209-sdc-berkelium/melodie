const express = require('express');
const app = express();
const port = 3001;

const { getQuestions, getAnswers, addQuestion, addAnswer, markQuestionHelpful, reportQuestion, markAnswerHelpful, reportAnswer} = require('../db/db.js');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../')));

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
    res.status(400).send('An error occurred getting questions. ' + err);
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
    res.status(400).send('An error occurred getting answers. ' + err);
  })
});

app.post('/qa/questions', (req, res) => {
  return addQuestion(req.body)
  .then(() => {
    res.sendStatus(201);
  })
  .catch((err) => {
    res.status(400).send('An error occurred adding a question. ' + err);
  })
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  return addAnswer(req.params.question_id, req.body)
  .then(() => {
    res.sendStatus(201);
  })
  .catch((err) => {
    res.status(400).send('An error occurred adding an answer. ' + err);
  })
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  return markQuestionHelpful(req.params.question_id)
  .then(() => {
    res.sendStatus(204);
  })
  .catch((err) => {
    res.status(400).send('An error occurred marking a question as helpful. ' + err);
  })
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  return reportQuestion(req.params.question_id)
  .then(() => {
    res.sendStatus(204);
  })
  .catch((err) => {
    res.status(400).send('An error occurred reporting a question. ' + err);
  })
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  return markAnswerHelpful(req.params.answer_id)
  .then(() => {
    res.sendStatus(204);
  })
  .catch((err) => {
    res.status(400).send('An error occurred marking an answer as helpful. ' + err);
  })
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  return reportAnswer(req.params.answer_id)
  .then(() => {
    res.sendStatus(204);
  })
  .catch((err) => {
    res.status(400).send('An error occurred reporting an answer. ' + err);
  })
});

app.listen(port, () => {
  console.log(`QA service listening on port ${port}`)
});