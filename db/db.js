require('dotenv').config()
const { Client } = require('pg');

const client = new Client({
  database: 'testqa',
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

function insertQuestion(qData) {
  const insertQuery = 'INSERT INTO questions (question_body, asker_name, asker_email, product_id) VALUES($1, $2, $3, $4)';
  const values = [qData.body, qData.name, qData.email, qData.product_id];
  return client.query(insertQuery, values);
};

async function insertAnswer(qId, aData) {
  const insertQuery = 'INSERT INTO answers (q_id, body, answerer_name, answerer_email) VALUES($1, $2, $3, $4)';
  const values = [qId, aData.body, aData.name, aData.email];
  await client.query(insertQuery, values);

  var pPromises = aData.photos.map((photo) => {
    const pQuery = 'INSERT INTO answers_photos (answer_id, url) VALUES((SELECT last_value FROM answers_answer_id_seq), $1)';
    const pValues = [photo];
    return client.query(pQuery, pValues);
  });
  return Promise.all(pPromises);
}

function incrementQuestionHelpfulness(qId) {
  const iQuery = 'UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1';
  return client.query(iQuery, [qId]);
};

function markQuestionReported(qId) {
  const rQuery = 'UPDATE questions SET reported = true WHERE question_id = $1';
  return client.query(rQuery, [qId]);
};

function incrementAnswerHelpfulness(aId) {
  const iQuery = 'UPDATE answers SET helpfulness = helpfulness + 1 WHERE id = $1';
  return client.query(iQuery, [aId]);
};

function markAnswerReported(aId) {
  const rQuery = 'UPDATE answers SET reported = true WHERE id = $1;';
  return client.query(rQuery, [aId]);
};

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

const addQuestion = async (qData) => {
  await insertQuestion(qData);
};

const addAnswer = async (qId, aData) => {
  await insertAnswer(qId, aData);
};

const markQuestionHelpful = async (qId) => {
  await incrementHelpfulness(qId);
};

const reportQuestion = async (qId) => {
  await markQuestionReported(qId);
};

const markAnswerHelpful = async (aId) => {
  await incrementAnswerHelpfulness(aId);
};

const reportAnswer = async (aId) => {
  await markAnswerReported(aId);
}

module.exports.getQuestions = getQuestions;
module.exports.getAnswers = getAnswers;
module.exports.addQuestion = addQuestion;
module.exports.addAnswer = addAnswer;
module.exports.markQuestionHelpful = markQuestionHelpful;
module.exports.reportQuestion = reportQuestion;
module.exports.markAnswerHelpful = markAnswerHelpful;
module.exports.reportAnswer = reportAnswer;
