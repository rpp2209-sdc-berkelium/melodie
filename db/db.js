require('dotenv').config()
const { Client } = require('pg');

const client = new Client({
  database: 'postgres',
  user: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD
});

client.connect();

function resolveQuestions(pId) {
  const qQuery = 'SELECT * FROM questions WHERE reported = 0 AND product_id =';
  return client.query(qQuery + pId);
}

function resolveAnswers(qId) {
  const aQuery = 'SELECT * FROM answers WHERE q_id ='
  return client.query(aQuery + qId);
}

function resolvePhotos(aId) {
  const pQuery = 'SELECT * FROM answers_photos WHERE answer_id ='
  return client.query(pQuery + aId);
}

module.exports.getQuestions = async (productId) => {
  var response = {
    product_id: productId
  };

  var qs = await resolveQuestions(productId);
  var fullQs = qs.rows.map(async (q, index) => {
    q.answers = {};
    var as = await resolveAnswers(q.question_id);
    for (var i = 0; i < as.rows.length; i++) {
      let a = as.rows[i];
      let photos = await resolvePhotos(a.id);
      a.photos = photos.rows;
      q.answers[a.id] = a;
    }
    return q;
  });

  response.results = await Promise.all(fullQs);
  return response;
};

