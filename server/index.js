const express = require('express');
const app = express();
const port = 3000;

const { getQuestions, getAnswers } = require('../db/db.js');

app.use(express.json());

app.get('/qa/questions', (req, res) => {
  return getQuestions(req.query.product_id)
  .then((result) => {
    res.status(200).send({
      "product_id": req.query.product_id,
      "results": result
    })
  });
});

app.listen(port, () => {
  console.log(`QA service listening on port ${port}`)
});