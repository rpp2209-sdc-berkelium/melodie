require('dotenv').config()
const { Client } = require('pg');

const client = new Client({
  database: 'postgres',
  user: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD
});

client.connect();

function resolveQuestions(pId, p, c) {
  const qQuery = 'SELECT * FROM questions WHERE reported = false AND product_id = $1 LIMIT $3 OFFSET $2';
  const values = [pId, (p - 1) * c, c];
  return client.query(qQuery, values);
}

function resolveAnswers(qId, p, c) {
  const aQuery = 'SELECT * FROM answers WHERE reported = false AND q_id = $1 LIMIT $3 OFFSET $2';
  const values = [qId, (p - 1) * c, c];
  return client.query(aQuery, values);
}

function resolvePhotos(aId) {
  const pQuery = 'SELECT * FROM answers_photos WHERE answer_id = $1';
  const values = [aId];
  return client.query(pQuery, values);
}

const getQuestions = async (productId, page, count) => {
  var qs = await resolveQuestions(productId, page, count);
  var fullQs = qs.rows.map(async (q, index) => {
    q.answers = {};
    await getAnswers(q.question_id, function (a) {
      q.answers[a.id] = a;
    }, 1, 5)
    return q;
  });
  response = await Promise.all(fullQs);
  return response;
};

const getAnswers = async (questionId, callback, page, count) => {
  var as = await resolveAnswers(questionId, page, count);
  for (var i = 0; i < as.rows.length; i++) {
    let a = as.rows[i];
    let photos = await resolvePhotos(a.id);
    a.photos = photos.rows;
    callback(a);
  }
}

module.exports.getQuestions = getQuestions;
module.exports.getAnswers = getAnswers;
