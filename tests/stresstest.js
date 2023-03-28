import http from "k6/http";
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 300,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 100,
      maxVUs: 1000,
    },
  },
};

export default function () {
  const BASE_URL = "http://localhost:3001";

  // GET questions list
  // http.get(`${BASE_URL}/qa/questions/?product_id=${randomIntBetween(900000, 1000000)}`);

  // // GET answers list
  // http.get(`${BASE_URL}/qa/questions/${randomIntBetween(3167067, 3518963)}/answers`);

  // // POST question
  // let question = {
  //   body: "What is a question?",
  //   name: "Alex Trebek",
  //   email: "atrebek@jeopardy.com",
  //   product_id: randomIntBetween(900000, 1000000)
  // };
  // http.post(`${BASE_URL}/qa/questions/`, JSON.stringify(question), {
  //   headers: { 'Content-Type': 'application/json'},
  // });

  // POST answer
  // let answer = {
  //   "body": "Daily double!",
  //   "name": "Vanna White",
  //   "email": "vannawhite@wof.com",
  //   "photos": ["https://dallas.culturemap.com/media-library/wheel-of-fortune.jpg", "https://flxt.tmsimg.com/assets/p22883681_b_v13_aa.jpg"]
  // };
  // http.post(`${BASE_URL}/qa/questions/${randomIntBetween(3167067, 3518963)}/answers`, JSON.stringify(answer), {
  //   headers: { 'Content-Type': 'application/json'},
  // });

  // // PUT question helpful
  // http.put(`${BASE_URL}/qa/questions/${randomIntBetween(3167067, 3518963)}/helpful`);

  // // PUT question reported
  // http.put(`${BASE_URL}/qa/questions/${randomIntBetween(3167067, 3518963)}/report`);

  // // PUT answer helpful
  // http.put(`${BASE_URL}/qa/answers/${randomIntBetween(6191376, 6879306)}/helpful`);

  // // PUT answer reported
  // http.put(`${BASE_URL}/qa/answers/${randomIntBetween(6191376, 6879306)}/report`);
};